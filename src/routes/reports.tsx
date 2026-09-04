import { createFileRoute } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { AppShell } from "@/components/rail/AppShell";
import { Disclaimer, SectionCard, StatusPill } from "@/components/rail/bits";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRail } from "@/lib/rail/store";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Planning Reports | RailOpt AI Block Planner" },
      {
        name: "description",
        content:
          "Print-friendly maintenance block planning report with tasks, departments, conflicts and optimization scores.",
      },
      { property: "og:title", content: "Planning Reports | RailOpt AI" },
      {
        property: "og:description",
        content: "Generate a maintenance planning report for review and authorization.",
      },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { blocks, tasks, comparison } = useRail();

  return (
    <AppShell title="Reports" subtitle="Maintenance planning report · Prototype simulation">
      <div className="space-y-5">
        <SectionCard
          title="Block planning report"
          description={`${blocks.length} blocks · ${comparison.after.tasks} tasks covered`}
          action={
            <Button onClick={() => window.print()}>
              <Printer className="size-4" /> Download / Print Report
            </Button>
          }
        >
          {blocks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Generate a block plan first to produce a report.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Block</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Departments</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Resources</TableHead>
                    <TableHead>Conflicts</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Availability impact</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blocks.map((b) => {
                    const res = Array.from(
                      new Set(
                        tasks
                          .filter((t) => b.taskIds.includes(t.taskId))
                          .flatMap((t) => t.resources),
                      ),
                    );
                    return (
                      <TableRow key={b.id}>
                        <TableCell className="font-mono text-xs font-semibold">{b.blockId}</TableCell>
                        <TableCell className="text-xs">{b.date}</TableCell>
                        <TableCell>{b.location}</TableCell>
                        <TableCell className="font-mono text-xs">{b.taskIds.join(", ")}</TableCell>
                        <TableCell className="text-xs">{b.departments.join(", ")}</TableCell>
                        <TableCell>
                          {b.start}–{b.end} ({b.duration} h)
                        </TableCell>
                        <TableCell className="max-w-52 truncate text-xs text-muted-foreground">
                          {res.join(", ")}
                        </TableCell>
                        <TableCell>
                          <StatusPill tone={b.conflicts.length ? "danger" : "success"}>
                            {b.conflicts.length || "None"}
                          </StatusPill>
                        </TableCell>
                        <TableCell className="tabular-nums">{b.score}</TableCell>
                        <TableCell className="tabular-nums">+{b.availabilityGain}%</TableCell>
                        <TableCell>
                          <StatusPill
                            tone={
                              b.status === "Approved"
                                ? "success"
                                : b.status === "Rejected"
                                  ? "danger"
                                  : b.status === "Conflict"
                                    ? "warning"
                                    : "info"
                            }
                          >
                            {b.status}
                          </StatusPill>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </SectionCard>
        <Disclaimer />
      </div>
    </AppShell>
  );
}
