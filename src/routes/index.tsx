import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CalendarClock,
  Clock,
  Gauge,
  LayoutGrid,
  Wrench,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/rail/AppShell";
import { Disclaimer, KpiCard, SectionCard } from "@/components/rail/bits";
import { Button } from "@/components/ui/button";
import { useRail } from "@/lib/rail/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Operations Dashboard | RailOpt AI Block Planner" },
      {
        name: "description",
        content:
          "Live view of asset condition, pending maintenance tasks, planned blocks and conflicts across the section.",
      },
      { property: "og:title", content: "Operations Dashboard | RailOpt AI" },
      {
        property: "og:description",
        content: "Asset availability, maintenance backlog and AI-optimized block plan at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Dashboard() {
  const { kpis, assets, tasks, comparison, blocks } = useRail();

  const condition = ["Good", "Fair", "Poor", "Critical"].map((c) => ({
    name: c,
    value: assets.filter((a) => a.condition === c).length,
  }));

  const byDept = ["Track", "Electrical/OHE", "Signal & Telecom", "Mechanical"].map((d) => ({
    name: d.replace("Signal & Telecom", "S&T").replace("Electrical/OHE", "OHE"),
    tasks: tasks.filter((t) => t.department === d).length,
  }));

  const utilization = ["MW1 10:00", "MW2 13:30", "MW3 23:30"].map((w, i) => ({
    name: w,
    used: [72, 48, 61][i],
    idle: [28, 52, 39][i],
  }));

  const trend = [
    { day: "Mon", availability: 89.8 },
    { day: "Tue", availability: 90.4 },
    { day: "Wed", availability: 91.2 },
    { day: "Thu", availability: 92.6 },
    { day: "Fri", availability: 93.4 },
    { day: "Sat", availability: kpis.availability },
  ];

  const beforeAfter = [
    { name: "Blocks", Before: comparison.before.blocks, After: comparison.after.blocks || 0 },
    { name: "Duration (h)", Before: comparison.before.durationHours, After: comparison.after.durationHours },
    { name: "Conflicts", Before: comparison.before.conflicts, After: comparison.after.conflicts },
  ];

  return (
    <AppShell title="Operations Dashboard" subtitle="Section Igatpuri–Kalyan · Prototype simulation data">
      <div className="space-y-5">
        <div className="rounded-lg border border-border bg-primary p-5 text-primary-foreground shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
            Key innovation
          </p>
          <p className="mt-2 max-w-4xl text-lg font-medium leading-snug sm:text-xl">
            “Coordinate compatible maintenance activities into fewer, smarter blocks — while protecting
            train operations and maximizing asset availability.”
          </p>
          <Button asChild variant="secondary" className="mt-4">
            <Link to="/planner">
              <BrainCircuit className="size-4" /> Open AI Block Planner
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Total Assets" value={kpis.totalAssets} icon={<LayoutGrid className="size-5" />} />
          <KpiCard
            label="Pending Tasks"
            value={kpis.pendingTasks}
            icon={<Wrench className="size-5" />}
            tone="warning"
          />
          <KpiCard
            label="High Priority Assets"
            value={kpis.highPriorityAssets}
            icon={<AlertTriangle className="size-5" />}
            tone="danger"
          />
          <KpiCard
            label="Today's Planned Blocks"
            value={kpis.todaysBlocks}
            hint={blocks.length ? "From latest AI plan" : "Run the AI planner"}
            icon={<CalendarClock className="size-5" />}
          />
          <KpiCard
            label="Conflicts Detected"
            value={kpis.conflicts}
            icon={<AlertTriangle className="size-5" />}
            tone={kpis.conflicts ? "danger" : "success"}
          />
          <KpiCard
            label="Asset Availability"
            value={`${kpis.availability.toFixed(1)}%`}
            icon={<Gauge className="size-5" />}
            tone="success"
          />
          <KpiCard
            label="Maintenance Hours Saved"
            value={`${kpis.hoursSaved} hrs`}
            hint="Prototype simulation"
            icon={<Clock className="size-5" />}
            tone="success"
          />
          <KpiCard
            label="Cross-dept Blocks"
            value={comparison.after.coordinated}
            icon={<Activity className="size-5" />}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Asset condition distribution" description="Monitored assets by condition">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={condition} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85}>
                  {condition.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard title="Maintenance tasks by department">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byDept}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="tasks" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard title="Maintenance window utilization" description="Percent of window consumed">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={utilization}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="used" stackId="a" fill="var(--chart-1)" />
                <Bar dataKey="idle" stackId="a" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard title="Asset availability trend" description="Prototype simulation">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis domain={[85, 100]} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="availability" stroke="var(--chart-2)" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        <SectionCard
          title="Before vs AI-optimized block comparison"
          description="Prototype Simulation Results — not actual Indian Railways statistics"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={beforeAfter}>
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

        <Disclaimer />
      </div>
    </AppShell>
  );
}
