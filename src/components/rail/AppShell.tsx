import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  TrainFront,
  Wrench,
  Activity,
  BrainCircuit,
  CalendarRange,
  BarChart3,
  FileText,
  Settings,
  Menu,
  ShieldAlert,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/trains", label: "Train Schedule", icon: TrainFront },
  { to: "/tasks", label: "Maintenance Tasks", icon: Wrench },
  { to: "/assets", label: "Asset Monitoring", icon: Activity },
  { to: "/planner", label: "Block Planner", icon: BrainCircuit, primary: true },
  { to: "/calendar", label: "Block Calendar", icon: CalendarRange },
  { to: "/results", label: "Optimization Results", icon: BarChart3 },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="grid size-9 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <TrainFront className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">RailOpt AI</p>
            <p className="text-[11px] text-sidebar-foreground/60">Block Planning System</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>
        <nav className="space-y-1 p-3">
          {NAV.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "primary" in item && item.primary && !active && "ring-1 ring-sidebar-primary/40",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
                {"primary" in item && item.primary && (
                  <span className="ml-auto rounded bg-success/15 px-1.5 py-0.5 text-[10px] font-semibold text-success">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-sidebar-border p-4">
          <p className="flex gap-2 text-[11px] leading-relaxed text-sidebar-foreground/60">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" />
            Decision-support prototype. Blocks must be validated and authorized by qualified railway
            personnel.
          </p>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 bg-foreground/30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">{title}</h1>
            {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="ml-auto hidden items-center gap-2 text-xs text-muted-foreground md:flex">
            <span className="size-2 rounded-full bg-success" />
            Section: Igatpuri–Kalyan · Central Division
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
