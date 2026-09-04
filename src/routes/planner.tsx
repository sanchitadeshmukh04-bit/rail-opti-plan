import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/rail/AppShell";
import { Disclaimer, SectionCard, StatusPill } from "@/components/rail/bits";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useRail } from "@/lib/rail/store";
import type { PlannedBlock } from "@/lib/rail/types";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Block Planner | RailOpt AI" },
      {
        name: "description",
        content:
          "Generate optimized maintenance blocks that group compatible track, OHE and S&T tasks without disrupting trains.",
      },
      { property: "og:title", content: "AI-Powered Automatic Block Planner | RailOpt AI" },
      {
        property: "og:description",
        content: "Cross-departmental block recommendations with explainable reasoning and conflict checks.",
      },
    ],
  }),
  component: PlannerPage,
});

const STEPS = [
  "Analyzing maintenance tasks...",
  "Checking train timetable...",
  "Checking asset priority...",
  "Checking department availability...",
  "Checking resource conflicts...",
  "Evaluating maintenance windows...",
  "Generating optimized block plan...",
];

function PlannerPage() {
  const { blocks, generatePlan, setBlockStatus, applySuggestion, tasks } = useRail();
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);

  const run = () => {
    setRunning(true);
    setStep(0);
    let i = 0;
    const tick = () => {
      i += 1;
      if (i < STEPS.length) {
        setStep(i);
        setTimeout(tick, 420);
      } else {
        const next = generatePlan();
        setRunning(false);
        setStep(-1);
        toast.success(`${next.length} optimized blocks generated`);
      }
    };
    setTimeout(tick, 420);
  };

  return (
    <AppShell
      title="AI-Powered Automatic Block Planner"
      subtitle="Decision-support recommendations for authorized planners"
    >
      <div className="space-y-5">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <BrainCircuit className="size-5 text-primary" /> Cross-departmental block optimization
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The planner evaluates {tasks.filter((t) => t.status !== "Completed").length} outstanding
                tasks against the train timetable, asset failure risk, resource pools, safety class and
                available maintenance windows, then groups only compatible activities.
              </p>
            </div>
            <Button size="lg" onClick={run} disabled={running}>
              {running ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              GENERATE OPTIMIZED BLOCK PLAN
            </Button>
          </div>

          {running && (
            <ol className="mt-5 space-y-2">
              {STEPS.map((s, i) => (
                <li
                  key={s}
                  className={`flex items-center gap-2 text-sm ${
                    i <= step ? "text-foreground" : "text-muted-foreground/50"
                  }`}
                >
                  {i < step ? (
                    <CheckCircle2 className="size-4 text-success" />
                  ) : i === step ? (
                    <Loader2 className="size-4 animate-spin text-primary" />
                  ) : (
                    <span className="size-4 rounded-full border border-border" />
                  )}
                  {s}
                </li>
              ))}
            </ol>
          )}
        </div>

        {!running && blocks.length === 0 && (
          <SectionCard title="No plan generated yet">
            <p className="text-sm text-muted-foreground">
              Run the planner to produce recommended blocks, explanations and conflict checks.
            </p>
          </SectionCard>
        )}

        <div className="grid gap-4 xl:grid-cols-2">
          {blocks.map((b) => (
            <BlockCard
              key={b.id}
              block={b}
              onApprove={() => {
                setBlockStatus(b.id, "Approved");
                toast.success(`${b.blockId} approved by planner`);
              }}
              onReject={() => {
                setBlockStatus(b.id, "Rejected");
                toast.error(`${b.blockId} rejected`);
              }}
              onApply={() => {
                applySuggestion(b.id);
                toast.success(`${b.blockId} rescheduled to the suggested conflict-free window`);
              }}
            />
          ))}
        </div>

        <Disclaimer />
      </div>
    </AppShell>
  );
}

function BlockCard({
  block,
  onApprove,
  onReject,
  onApply,
}: {
  block: PlannedBlock;
  onApprove: () => void;
  onReject: () => void;
  onApply: () => void;
}) {
  const tone =
    block.status === "Approved"
      ? "success"
      : block.status === "Rejected"
        ? "danger"
        : block.status === "Conflict"
          ? "warning"
          : "info";

  return (
    <article className="rounded-lg border border-border bg-card shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <p className="font-mono text-sm font-semibold">{block.blockId}</p>
          <p className="text-xs text-muted-foreground">
            {block.location} · {block.date} · {block.start}–{block.end} ({block.duration} h)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill tone="neutral">Score {block.score}</StatusPill>
          <StatusPill tone={tone}>
            {block.status === "Approved" && "🟢 "}
            {block.status}
          </StatusPill>
        </div>
      </header>

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          {block.departments.map((d) => (
            <StatusPill key={d} tone="info">
              ✓ {d}
            </StatusPill>
          ))}
        </div>
        <p className="text-sm">
          <span className="text-muted-foreground">Tasks: </span>
          <span className="font-mono">{block.taskIds.join(" + ")}</span>
        </p>

        {block.conflicts.length > 0 && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <AlertTriangle className="size-4" /> Conflict detected
            </p>
            <ul className="mt-1 space-y-1 text-xs text-foreground/80">
              {block.conflicts.map((c, i) => (
                <li key={i}>
                  <strong>{c.type}:</strong> {c.detail}
                </li>
              ))}
            </ul>
            {block.suggestedStart && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs">
                  Suggested alternative: <strong>{block.suggestedStart}–{block.suggestedEnd}</strong>
                </span>
                <Button size="sm" variant="outline" onClick={onApply}>
                  Apply Suggested Change
                </Button>
              </div>
            )}
          </div>
        )}

        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-3 py-2 text-sm font-medium">
            Why this recommendation?
            <ChevronDown className="size-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pt-2">
            <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
              {block.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button size="sm" onClick={onApprove} disabled={block.status === "Approved"}>
            <CheckCircle2 className="size-4" /> Approve Block
          </Button>
          <Button size="sm" variant="outline" onClick={onApply} disabled={!block.suggestedStart}>
            Modify
          </Button>
          <Button size="sm" variant="ghost" onClick={onReject}>
            <XCircle className="size-4 text-destructive" /> Reject
          </Button>
        </div>
      </div>
    </article>
  );
}
