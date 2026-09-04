import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/rail/AppShell";
import { Disclaimer, KpiCard, SectionCard } from "@/components/rail/bits";
import { useRail } from "@/lib/rail/store";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Optimization Results | RailOpt AI Block Planner" },
      {
        name: "description",
        content:
          "Prototype simulation comparing maintenance blocks, duration, conflicts and asset availability before and after optimization.",
      },
      { property: "og:title", content: "Optimization Results | RailOpt AI" },
      {
        property: "og:description",
        content: "Before vs after comparison of the AI-optimized maintenance block plan.",
      },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const { comparison, blocks, tasks } = useRail();
  const { before, after } = comparison;

  const data = [
    { name: "Blocks", Before: before.blocks, After: after.blocks },
    { name: "Duration (h)", Before: before.durationHours, After: after.durationHours },
    { name: "Separate activities", Before: before.separateActivities, After: after.coordinated },
    { name: "Conflicts", Before: before.conflicts, After: after.conflicts },
  ];

  const availability = [
    { name: "Asset availability %", Before: before.availability, After: after.availability },
    { name: "Resource utilization %", Before: 61, After: Math.min(96, 61 + after.coordinated * 5) },
  ];

  return (
    <AppShell title="Optimization Results" subtitle="Prototype Simulation Results — not official statistics">
      <div className="space-y-5">
        {blocks.length === 0 && (
          <SectionCard title="No plan generated yet">
            <p className="text-sm text-muted-foreground">
              Run the AI Block Planner first; results are calculated from the generated plan.
            </p>
          </SectionCard>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Before optimization" description="Departments planning independently">
            <div className="grid gap-3 sm:grid-cols-2">
              <KpiCard label="Maintenance blocks" value={before.blocks} tone="danger" />
              <KpiCard label="Total block duration" value={`${before.durationHours} h`} tone="danger" />
              <KpiCard label="Separate dept activities" value={before.separateActivities} tone="warning" />
              <KpiCard label="Conflicts" value={before.conflicts} tone="danger" />
            </div>
          </SectionCard>
          <SectionCard title="After AI optimization" description="Coordinated cross-departmental blocks">
            <div className="grid gap-3 sm:grid-cols-2">
              <KpiCard label="Maintenance blocks" value={after.blocks} tone="success" />
              <KpiCard label="Total block duration" value={`${after.durationHours} h`} tone="success" />
              <KpiCard label="Coordinated activities" value={after.coordinated} tone="success" />
              <KpiCard label="Conflicts" value={after.conflicts} tone={after.conflicts ? "warning" : "success"} />
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Blocks, duration and conflicts">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Before" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="After" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard
            title="Asset availability & resource utilization"
            description="Availability = available time / total time × 100 (prototype simulation)"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={availability}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis domain={[50, 100]} fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Before" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="After" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
          <SectionCard title="Tasks completed per plan">
            <div className="grid gap-3 sm:grid-cols-2">
              <KpiCard label="Tasks in backlog" value={tasks.length} />
              <KpiCard label="Tasks covered by plan" value={after.tasks} tone="success" />
              <KpiCard
                label="Tasks per block"
                value={after.blocks ? (after.tasks / after.blocks).toFixed(1) : "—"}
                tone="success"
              />
              <KpiCard
                label="Availability gain"
                value={`+${Math.max(0, after.availability - before.availability).toFixed(1)}%`}
                tone="success"
              />
            </div>
          </SectionCard>
        </div>

        <Disclaimer />
      </div>
    </AppShell>
  );
}
