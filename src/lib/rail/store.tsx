import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { BASELINE, seedAssets, seedResources, seedTasks, seedTrains } from "./data";
import { summarize } from "./optimizer";
import { generateOptimizedPlan } from "./api";
import type { Asset, BlockStatus, PlannedBlock, Resource, Task, Train } from "./types";

interface RailState {
  trains: Train[];
  assets: Asset[];
  tasks: Task[];
  resources: Resource[];
  blocks: PlannedBlock[];
  hasPlan: boolean;
  addTrain: (t: Omit<Train, "id">) => void;
  updateTrain: (id: string, t: Partial<Train>) => void;
  deleteTrain: (id: string) => void;
  addTask: (t: Omit<Task, "id">) => void;
  updateTask: (id: string, t: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  generatePlan: () => Promise<PlannedBlock[]>;
  setBlockStatus: (id: string, status: BlockStatus) => void;
  applySuggestion: (id: string) => void;
  kpis: ReturnType<typeof computeKpis>;
  comparison: { before: typeof BASELINE; after: ReturnType<typeof summarize> & { availability: number } };
}

const RailContext = createContext<RailState | null>(null);

function computeKpis(assets: Asset[], tasks: Task[], blocks: PlannedBlock[]) {
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const highPriority = assets.filter((a) => a.criticality === "Critical" || a.failureRisk >= 75).length;
  const conflicts = blocks.reduce((s, b) => s + (b.status === "Rejected" ? 0 : b.conflicts.length), 0);
  const availability =
    Math.round((assets.reduce((s, a) => s + a.availability, 0) / Math.max(1, assets.length)) * 10) / 10;
  const approved = blocks.filter((b) => b.status === "Approved");
  const naive = tasks.filter((t) => t.status !== "Completed").reduce((s, t) => s + t.duration, 0);
  const planned = blocks.filter((b) => b.status !== "Rejected").reduce((s, b) => s + b.duration, 0);
  const saved = blocks.length ? Math.round(Math.max(0, naive - planned) * 10) / 10 : 0;
  return {
    totalAssets: 236 + assets.length,
    pendingTasks: pending,
    highPriorityAssets: highPriority,
    todaysBlocks: blocks.filter((b) => b.status !== "Rejected").length,
    conflicts,
    availability: Math.min(99.9, availability + approved.length * 0.4),
    hoursSaved: saved,
  };
}

export function RailProvider({ children }: { children: ReactNode }) {
  const [trains, setTrains] = useState<Train[]>(seedTrains);
  const [assets] = useState<Asset[]>(seedAssets);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [resources] = useState<Resource[]>(seedResources);
  const [blocks, setBlocks] = useState<PlannedBlock[]>([]);
  const [hasPlan, setHasPlan] = useState(false);

  const uid = () => crypto.randomUUID();

  const generatePlan = useCallback(async (): Promise<PlannedBlock[]> => {
  try {
    const result = await generateOptimizedPlan(
      trains,
      assets,
      tasks,
      resources,
    );

    const next = result.blocks;

    setBlocks(next);
    setHasPlan(true);

    setTasks((prev) =>
      prev.map((t) =>
        next.some((b) => b.taskIds.includes(t.taskId)) &&
        t.status === "Pending"
          ? { ...t, status: "Planned" }
          : t,
      ),
    );

    return next;
  } catch (error) {
    console.error("RailOpt optimization failed:", error);

    throw error;
  }
}, [tasks, trains, assets, resources]);

  const setBlockStatus = useCallback((id: string, status: BlockStatus) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }, []);

  const applySuggestion = useCallback((id: string) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id && b.suggestedStart && b.suggestedEnd
          ? { ...b, start: b.suggestedStart, end: b.suggestedEnd, conflicts: [], status: "Recommended" }
          : b,
      ),
    );
  }, []);

  const value = useMemo<RailState>(() => {
    const after = summarize(blocks);
    const kpis = computeKpis(assets, tasks, blocks);
    return {
      trains,
      assets,
      tasks,
      resources,
      blocks,
      hasPlan,
      addTrain: (t) => setTrains((p) => [{ ...t, id: uid() }, ...p]),
      updateTrain: (id, t) => setTrains((p) => p.map((x) => (x.id === id ? { ...x, ...t } : x))),
      deleteTrain: (id) => setTrains((p) => p.filter((x) => x.id !== id)),
      addTask: (t) => setTasks((p) => [{ ...t, id: uid() }, ...p]),
      updateTask: (id, t) => setTasks((p) => p.map((x) => (x.id === id ? { ...x, ...t } : x))),
      deleteTask: (id) => setTasks((p) => p.filter((x) => x.id !== id)),
      generatePlan,
      setBlockStatus,
      applySuggestion,
      kpis,
      comparison: {
        before: BASELINE,
        after: { ...after, availability: kpis.availability },
      },
    };
  }, [trains, assets, tasks, resources, blocks, hasPlan, generatePlan, setBlockStatus, applySuggestion]);

  return <RailContext.Provider value={value}>{children}</RailContext.Provider>;
}

export function useRail() {
  const ctx = useContext(RailContext);
  if (!ctx) throw new Error("useRail must be used within RailProvider");
  return ctx;
}
