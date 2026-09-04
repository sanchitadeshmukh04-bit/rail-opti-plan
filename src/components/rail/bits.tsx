import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function StatusPill({
  tone,
  children,
  className,
}: {
  tone: "success" | "warning" | "danger" | "info" | "neutral";
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    success: "bg-success/12 text-success ring-success/25",
    warning: "bg-warning/15 text-warning-foreground ring-warning/40",
    danger: "bg-destructive/10 text-destructive ring-destructive/25",
    info: "bg-info/10 text-info ring-info/25",
    neutral: "bg-muted text-muted-foreground ring-border",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function priorityTone(p: string) {
  if (p === "Critical") return "danger" as const;
  if (p === "High") return "warning" as const;
  if (p === "Medium") return "info" as const;
  return "neutral" as const;
}

export function conditionTone(c: string) {
  if (c === "Good") return "success" as const;
  if (c === "Fair") return "info" as const;
  if (c === "Poor") return "warning" as const;
  return "danger" as const;
}

export function KpiCard({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const bar = {
    neutral: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
  }[tone];
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm">
      <span className={cn("absolute inset-y-0 left-0 w-1", bar)} />
      <div className="flex items-start justify-between gap-2 pl-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-border bg-card shadow-sm", className)}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Disclaimer() {
  return (
    <p className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-foreground/80">
      This prototype is a decision-support and planning system. Final maintenance blocks must be validated
      and authorized by qualified railway personnel according to applicable railway safety procedures.
    </p>
  );
}
