import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/rail/AppShell";
import { Disclaimer, SectionCard } from "@/components/rail/bits";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MAINTENANCE_WINDOWS } from "@/lib/rail/data";
import { useRail } from "@/lib/rail/store";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Planner Settings | RailOpt AI Block Planner" },
      {
        name: "description",
        content:
          "Configure optimization weights, maintenance windows and resource pools used by the block planner.",
      },
      { property: "og:title", content: "Planner Settings | RailOpt AI" },
      {
        property: "og:description",
        content: "Tune optimization weights and review maintenance windows and resource availability.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { resources } = useRail();
  const [weights, setWeights] = useState({ priority: 40, risk: 25, grouping: 25, disruption: 10 });
  const [protectTrains, setProtectTrains] = useState(true);
  const [allowCrossDept, setAllowCrossDept] = useState(true);

  return (
    <AppShell title="Settings" subtitle="Optimization parameters and resource configuration">
      <div className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Optimization weights" description="Heuristic scoring configuration">
            <div className="space-y-5">
              {(
                [
                  ["priority", "Task priority"],
                  ["risk", "Asset failure risk"],
                  ["grouping", "Task grouping benefit"],
                  ["disruption", "Train disruption penalty"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Label>{label}</Label>
                    <span className="tabular-nums text-muted-foreground">{weights[key]}</span>
                  </div>
                  <Slider
                    value={[weights[key]]}
                    max={100}
                    step={5}
                    onValueChange={([v]) => setWeights((w) => ({ ...w, [key]: v ?? 0 }))}
                  />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Safety and coordination rules">
            <div className="space-y-4">
              <label className="flex items-center justify-between gap-4 text-sm">
                <span>
                  Always protect scheduled train movements
                  <span className="block text-xs text-muted-foreground">
                    Blocks never overlap a protected movement
                  </span>
                </span>
                <Switch checked={protectTrains} onCheckedChange={setProtectTrains} />
              </label>
              <label className="flex items-center justify-between gap-4 text-sm">
                <span>
                  Allow cross-departmental blocks
                  <span className="block text-xs text-muted-foreground">
                    Track, OHE and S&T may share one protection
                  </span>
                </span>
                <Switch checked={allowCrossDept} onCheckedChange={setAllowCrossDept} />
              </label>
              <div>
                <p className="text-sm font-medium">Maintenance windows</p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {MAINTENANCE_WINDOWS.map((w) => (
                    <li key={w.id}>
                      <span className="font-mono">{w.id}</span> · {w.label} · {w.start}–{w.end}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Resource pool" description="Manpower, equipment and vehicles by department">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.type}</TableCell>
                    <TableCell>{r.department}</TableCell>
                    <TableCell className="tabular-nums">{r.availableUnits}</TableCell>
                    <TableCell className="tabular-nums">{r.totalUnits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <Disclaimer />
      </div>
    </AppShell>
  );
}
