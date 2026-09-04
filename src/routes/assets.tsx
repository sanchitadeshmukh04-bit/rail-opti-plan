import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/rail/AppShell";
import { SectionCard, StatusPill, conditionTone, priorityTone } from "@/components/rail/bits";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRail } from "@/lib/rail/store";

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Asset Monitoring | RailOpt AI Block Planner" },
      {
        name: "description",
        content:
          "Condition, failure risk, criticality and availability of track, OHE and signalling assets.",
      },
      { property: "og:title", content: "Asset Monitoring | RailOpt AI" },
      {
        property: "og:description",
        content: "Health monitoring for section assets with failure-risk scoring.",
      },
    ],
  }),
  component: AssetsPage,
});

function AssetsPage() {
  const { assets } = useRail();
  const chart = assets.map((a) => ({ name: a.assetId, risk: a.failureRisk, availability: a.availability }));

  return (
    <AppShell title="Asset Monitoring" subtitle="Condition and failure-risk scoring across the section">
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {assets.slice(0, 4).map((a) => (
            <div key={a.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm font-semibold">{a.assetId}</p>
                <StatusPill tone={conditionTone(a.condition)}>{a.condition}</StatusPill>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {a.type} · {a.location}
              </p>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Failure risk</span>
                  <span className="font-semibold tabular-nums">{a.failureRisk}/100</span>
                </div>
                <Progress value={a.failureRisk} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Availability</span>
                <span className="font-semibold text-foreground tabular-nums">{a.availability}%</span>
              </div>
            </div>
          ))}
        </div>

        <SectionCard title="Asset condition & risk" description="Failure risk vs current availability">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={11} interval={0} angle={-25} height={60} textAnchor="end" />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="risk" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="availability" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Asset register" description={`${assets.length} monitored assets`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Last maintenance</TableHead>
                  <TableHead>Failure risk</TableHead>
                  <TableHead>Criticality</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Next due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs font-semibold">{a.assetId}</TableCell>
                    <TableCell>{a.type}</TableCell>
                    <TableCell>{a.location}</TableCell>
                    <TableCell>
                      <StatusPill tone={conditionTone(a.condition)}>{a.condition}</StatusPill>
                    </TableCell>
                    <TableCell className="text-xs">{a.lastMaintenance}</TableCell>
                    <TableCell>
                      <StatusPill
                        tone={a.failureRisk >= 75 ? "danger" : a.failureRisk >= 50 ? "warning" : "success"}
                      >
                        {a.failureRisk}/100
                      </StatusPill>
                    </TableCell>
                    <TableCell>
                      <StatusPill tone={priorityTone(a.criticality)}>{a.criticality}</StatusPill>
                    </TableCell>
                    <TableCell className="tabular-nums">{a.availability}%</TableCell>
                    <TableCell className="text-xs">{a.nextDue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
