import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/rail/AppShell";
import { SectionCard, StatusPill } from "@/components/rail/bits";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MAINTENANCE_WINDOWS } from "@/lib/rail/data";
import { toMin } from "@/lib/rail/optimizer";
import { useRail } from "@/lib/rail/store";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Block Calendar | RailOpt AI Block Planner" },
      {
        name: "description",
        content:
          "Timeline of train movements, maintenance windows and recommended blocks across the section.",
      },
      { property: "og:title", content: "Block Calendar | RailOpt AI" },
      {
        property: "og:description",
        content: "Day, week and timeline views of planned maintenance blocks and protected trains.",
      },
    ],
  }),
  component: CalendarPage,
});

const START = 8 * 60;
const END = 20 * 60;
const span = END - START;
const pct = (m: number) => `${((Math.min(Math.max(m, START), END) - START) / span) * 100}%`;

function CalendarPage() {
  const { trains, blocks } = useRail();
  const [view, setView] = useState("day");

  const deptColor = (d: string) =>
    d === "Track"
      ? "bg-chart-1"
      : d === "Electrical/OHE"
        ? "bg-chart-3"
        : d === "Signal & Telecom"
          ? "bg-chart-5"
          : "bg-chart-2";

  return (
    <AppShell title="Block Calendar" subtitle="Trains, maintenance windows and recommended blocks">
      <div className="space-y-5">
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-2 text-xs">
          <StatusPill tone="info">Train movement</StatusPill>
          <StatusPill tone="neutral">Maintenance window</StatusPill>
          <StatusPill tone="success">Recommended block</StatusPill>
          <StatusPill tone="danger">Conflict</StatusPill>
        </div>

        {view === "week" ? (
          <SectionCard title="Week overview" description="Blocks grouped by required date">
            <div className="grid gap-3 md:grid-cols-4">
              {Array.from(new Set(blocks.map((b) => b.date)))
                .sort()
                .map((d) => (
                  <div key={d} className="rounded-md border border-border p-3">
                    <p className="text-xs font-semibold">{d}</p>
                    <ul className="mt-2 space-y-1 text-xs">
                      {blocks
                        .filter((b) => b.date === d)
                        .map((b) => (
                          <li key={b.id} className="rounded bg-muted px-2 py-1 font-mono">
                            {b.blockId} · {b.start}–{b.end}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              {blocks.length === 0 && (
                <p className="text-sm text-muted-foreground">Generate a plan to populate the calendar.</p>
              )}
            </div>
          </SectionCard>
        ) : (
          <SectionCard title="Day timeline" description="08:00 – 20:00 · Igatpuri–Kalyan section">
            <div className="min-w-[720px] space-y-4 overflow-x-auto">
              <div className="relative h-6 border-b border-border text-[10px] text-muted-foreground">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} className="absolute -translate-x-1/2" style={{ left: pct(START + i * 120) }}>
                    {String(8 + i * 2).padStart(2, "0")}:00
                  </span>
                ))}
              </div>

              <Row label="Maintenance windows">
                {MAINTENANCE_WINDOWS.filter((w) => toMin(w.start) < END).map((w) => (
                  <div
                    key={w.id}
                    className="absolute inset-y-1 rounded bg-muted ring-1 ring-inset ring-border"
                    style={{ left: pct(toMin(w.start)), width: `calc(${pct(toMin(w.end))} - ${pct(toMin(w.start))})` }}
                    title={w.label}
                  />
                ))}
              </Row>

              <Row label="Train movements">
                {trains
                  .filter((t) => toMin(t.arrival) >= START && toMin(t.arrival) <= END)
                  .map((t) => (
                    <div
                      key={t.id}
                      className="absolute inset-y-1 w-1.5 rounded bg-info"
                      style={{ left: pct(toMin(t.arrival)) }}
                      title={`${t.trainId} @ ${t.location} ${t.arrival}`}
                    />
                  ))}
              </Row>

              {blocks.map((b) => (
                <Row key={b.id} label={`${b.blockId} · ${b.location}`}>
                  <div
                    className={`absolute inset-y-1 flex items-center gap-1 overflow-hidden rounded px-2 text-[10px] font-semibold text-primary-foreground ${
                      b.conflicts.length ? "bg-destructive" : b.status === "Approved" ? "bg-success" : "bg-primary"
                    }`}
                    style={{
                      left: pct(toMin(b.start)),
                      width: `calc(${pct(toMin(b.end))} - ${pct(toMin(b.start))})`,
                    }}
                  >
                    {b.taskIds.join("+")}
                  </div>
                  {b.departments.map((d, i) => (
                    <span
                      key={d}
                      className={`absolute bottom-0 h-1 rounded ${deptColor(d)}`}
                      style={{
                        left: `calc(${pct(toMin(b.start))} + ${i * 14}px)`,
                        width: "12px",
                      }}
                    />
                  ))}
                </Row>
              ))}

              {blocks.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No blocks yet — run the AI Block Planner to populate the timeline.
                </p>
              )}
            </div>
          </SectionCard>
        )}
      </div>
    </AppShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-44 shrink-0 truncate text-xs text-muted-foreground">{label}</span>
      <div className="relative h-8 flex-1 rounded border border-border bg-background">{children}</div>
    </div>
  );
}
