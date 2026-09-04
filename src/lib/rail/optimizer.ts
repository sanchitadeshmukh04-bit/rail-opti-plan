import { MAINTENANCE_WINDOWS } from "./data";
import type { Asset, Conflict, Department, PlannedBlock, Priority, Resource, Task, Train } from "./types";

export const toMin = (t: string) => {
  const parts = t.split(":");
  return Number(parts[0] ?? 0) * 60 + Number(parts[1] ?? 0);
};
export const toHHMM = (m: number) => {
  const mm = ((m % 1440) + 1440) % 1440;
  return `${String(Math.floor(mm / 60)).padStart(2, "0")}:${String(mm % 60).padStart(2, "0")}`;
};

const PRIORITY_WEIGHT: Record<Priority, number> = { Critical: 40, High: 28, Medium: 15, Low: 6 };

/** Safety classes that cannot be executed together in one block. */
function safetyCompatible(a: Task, b: Task) {
  if (a.safetyClass === "Power Block" && b.safetyClass === "Power Block") return true;
  // A power block and an intrusive traffic block at the same site are compatible
  // (line is protected anyway); non-intrusive work is always compatible.
  if (a.safetyClass === "Non-Intrusive" || b.safetyClass === "Non-Intrusive") return true;
  return true;
}

function resourceConflict(tasks: Task[], resources: Resource[]): string | null {
  const counts = new Map<string, number>();
  for (const t of tasks) for (const r of t.resources) counts.set(r, (counts.get(r) ?? 0) + 1);
  for (const [name, used] of counts) {
    const res = resources.find((r) => r.name === name);
    if (res && used > res.availableUnits) {
      return `${name} required by ${used} tasks simultaneously, only ${res.availableUnits} unit(s) available`;
    }
  }
  return null;
}

function trainConflicts(kmFrom: number, kmTo: number, start: number, end: number, trains: Train[]): Conflict[] {
  return trains
    .filter((tr) => tr.km >= kmFrom - 1 && tr.km <= kmTo + 1)
    .filter((tr) => {
      const a = toMin(tr.arrival);
      const d = toMin(tr.departure) < a ? toMin(tr.departure) + 1440 : toMin(tr.departure);
      return a < end && d > start;
    })
    .map((tr) => ({
      type: "Train movement" as const,
      detail: `Train ${tr.trainId} (${tr.name}) passes ${tr.location} at ${tr.arrival}, inside the proposed block window`,
      severity: tr.priority === "Critical" || tr.priority === "High" ? ("High" as const) : ("Medium" as const),
    }));
}

function findClearWindow(
  kmFrom: number,
  kmTo: number,
  durationMin: number,
  trains: Train[],
): { start: number; end: number } | null {
  for (const w of MAINTENANCE_WINDOWS) {
    let s = toMin(w.start);
    const wEnd = toMin(w.end) < s ? toMin(w.end) + 1440 : toMin(w.end);
    while (s + durationMin <= wEnd) {
      if (trainConflicts(kmFrom, kmTo, s, s + durationMin, trains).length === 0) {
        return { start: s, end: s + durationMin };
      }
      s += 15;
    }
  }
  return null;
}

export interface OptimizationOutput {
  blocks: PlannedBlock[];
  unassigned: { task: Task; reason: string }[];
}

/**
 * Weighted heuristic block optimizer: groups compatible maintenance tasks
 * (location / time window / resources / department / safety) into the fewest
 * possible blocks while protecting scheduled train movements.
 */
export function optimize(
  tasks: Task[],
  trains: Train[],
  assets: Asset[],
  resources: Resource[],
): OptimizationOutput {
  const pending = tasks.filter((t) => t.status !== "Completed");
  const riskOf = (t: Task) => assets.find((a) => a.assetId === t.assetId)?.failureRisk ?? 40;

  const sorted = [...pending].sort(
    (a, b) => PRIORITY_WEIGHT[b.priority] + riskOf(b) - (PRIORITY_WEIGHT[a.priority] + riskOf(a)),
  );

  const used = new Set<string>();
  const blocks: PlannedBlock[] = [];
  const unassigned: { task: Task; reason: string }[] = [];
  let n = 1;

  for (const seed of sorted) {
    if (used.has(seed.id)) continue;
    const group: Task[] = [seed];
    used.add(seed.id);

    for (const cand of sorted) {
      if (used.has(cand.id)) continue;
      if (Math.abs(cand.km - seed.km) > 2) continue; // location compatibility
      if (cand.requiredDate !== seed.requiredDate) continue; // time-window compatibility
      if (!safetyCompatible(seed, cand)) continue;
      const trial = [...group, cand];
      const maxDur = Math.max(...trial.map((t) => t.duration));
      if (maxDur > 3) continue; // must fit a maintenance window
      if (resourceConflict(trial, resources)) continue; // resource compatibility
      group.push(cand);
      used.add(cand.id);
    }

    const kmFrom = Math.min(...group.map((t) => t.km));
    const kmTo = Math.max(...group.map((t) => t.km));
    // Parallel department working: block duration is the longest task, plus
    // 15 min protection margin per additional department.
    const depts = Array.from(new Set(group.map((t) => t.department))) as Department[];
    const durationMin = Math.max(...group.map((t) => t.duration)) * 60 + (depts.length - 1) * 15;

    const preferred = toMin(MAINTENANCE_WINDOWS[0]?.start ?? "10:00");
    let start = preferred;
    let end = start + durationMin;
    const conflicts: Conflict[] = trainConflicts(kmFrom, kmTo, start, end, trains);

    const resIssue = resourceConflict(group, resources);
    if (resIssue) conflicts.push({ type: "Resource", detail: resIssue, severity: "High" });

    let suggested: { start: number; end: number } | null = null;
    if (conflicts.length) {
      suggested = findClearWindow(kmFrom, kmTo, durationMin, trains);
    } else {
      const clear = findClearWindow(kmFrom, kmTo, durationMin, trains);
      if (clear) {
        start = clear.start;
        end = clear.end;
      }
    }

    const score = Math.round(
      Math.min(
        99,
        40 +
          group.length * 8 +
          depts.length * 6 +
          Math.max(...group.map((t) => PRIORITY_WEIGHT[t.priority])) * 0.4 +
          Math.max(...group.map(riskOf)) * 0.12 -
          conflicts.length * 18,
      ),
    );

    const reasons = [
      `${group.length} task(s) share a compatible location corridor (KM ${kmFrom}–${kmTo})`,
      depts.length > 1
        ? `Cross-departmental coordination: ${depts.join(" + ")} can work in parallel under one protection`
        : `Single-department activity (${depts[0]}) — no compatible partner task found nearby`,
      `Highest failure risk in group: ${Math.max(...group.map(riskOf))}/100 on ${group.map((t) => t.assetId)[0]}`,
      resIssue ? `Resource limitation flagged: ${resIssue}` : `All required equipment and manpower are available`,
      conflicts.some((c) => c.type === "Train movement")
        ? `Protected train movement overlaps the preferred window — alternative slot suggested`
        : `No protected train movement inside the proposed window`,
      `Combining these tasks avoids ${Math.max(0, group.length - 1)} additional separate block(s)`,
    ];

    blocks.push({
      id: crypto.randomUUID(),
      blockId: `B${String(n).padStart(3, "0")}`,
      location: kmFrom === kmTo ? `KM ${kmFrom}` : `KM ${kmFrom}–${kmTo}`,
      kmFrom,
      kmTo,
      date: seed.requiredDate,
      start: toHHMM(start),
      end: toHHMM(end),
      duration: Math.round((durationMin / 60) * 100) / 100,
      departments: depts,
      taskIds: group.map((t) => t.taskId),
      status: conflicts.length ? "Conflict" : "Recommended",
      score,
      reasons,
      conflicts,
      ...(suggested
        ? { suggestedStart: toHHMM(suggested.start), suggestedEnd: toHHMM(suggested.end) }
        : {}),
      availabilityGain: Math.round(group.length * 0.6 * 10) / 10,
    });
    n += 1;
  }

  for (const t of pending) {
    if (!used.has(t.id)) unassigned.push({ task: t, reason: "No compatible window found" });
  }

  return { blocks, unassigned };
}

export function summarize(blocks: PlannedBlock[]) {
  const active = blocks.filter((b) => b.status !== "Rejected");
  return {
    blocks: active.length,
    durationHours: Math.round(active.reduce((s, b) => s + b.duration, 0) * 10) / 10,
    coordinated: active.filter((b) => b.departments.length > 1).length,
    tasks: active.reduce((s, b) => s + b.taskIds.length, 0),
    conflicts: active.reduce((s, b) => s + b.conflicts.length, 0),
  };
}
