import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/rail/AppShell";
import { SectionCard, StatusPill, priorityTone } from "@/components/rail/bits";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRail } from "@/lib/rail/store";
import type { Department, Priority, Task } from "@/lib/rail/types";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Maintenance Tasks | RailOpt AI Block Planner" },
      {
        name: "description",
        content:
          "Track, OHE, S&T and mechanical maintenance backlog with duration, priority and required resources.",
      },
      { property: "og:title", content: "Maintenance Tasks | RailOpt AI" },
      {
        property: "og:description",
        content: "Departmental maintenance backlog feeding the AI block planner.",
      },
    ],
  }),
  component: TasksPage,
});

const DEPARTMENTS: Department[] = ["Track", "Electrical/OHE", "Signal & Telecom", "Mechanical", "Other"];
const PRIORITIES: Priority[] = ["Critical", "High", "Medium", "Low"];

const empty: Omit<Task, "id"> = {
  taskId: "",
  assetId: "",
  location: "KM 120",
  km: 120,
  department: "Track",
  maintenanceType: "",
  duration: 1,
  priority: "Medium",
  requiredDate: "2026-09-05",
  resources: [],
  safetyClass: "Traffic Block",
  status: "Pending",
};

function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useRail();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [prio, setPrio] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState(empty);

  const rows = useMemo(
    () =>
      tasks.filter(
        (t) =>
          (dept === "all" || t.department === dept) &&
          (prio === "all" || t.priority === prio) &&
          `${t.taskId} ${t.assetId} ${t.location} ${t.maintenanceType}`
            .toLowerCase()
            .includes(q.toLowerCase()),
      ),
    [tasks, q, dept, prio],
  );

  const submit = () => {
    if (!form.taskId || !form.assetId) {
      toast.error("Task ID and Asset ID are required");
      return;
    }
    if (editing) {
      updateTask(editing.id, form);
      toast.success(`Task ${form.taskId} updated`);
    } else {
      addTask(form);
      toast.success(`Task ${form.taskId} added to the backlog`);
    }
    setOpen(false);
    setEditing(null);
    setForm(empty);
  };

  return (
    <AppShell title="Maintenance Tasks" subtitle="Departmental backlog available for block planning">
      <SectionCard
        title={`${rows.length} tasks`}
        description="Filter by department and priority"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search asset / location"
                className="w-52 pl-8"
              />
            </div>
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={prio} onValueChange={setPrio}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog
              open={open}
              onOpenChange={(o) => {
                setOpen(o);
                if (!o) {
                  setEditing(null);
                  setForm(empty);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="size-4" /> Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editing ? "Edit task" : "Add maintenance task"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Task ID" value={form.taskId} onChange={(v) => setForm({ ...form, taskId: v })} />
                  <Field label="Asset ID" value={form.assetId} onChange={(v) => setForm({ ...form, assetId: v })} />
                  <Field
                    label="Location"
                    value={form.location}
                    onChange={(v) =>
                      setForm({ ...form, location: v, km: Number(v.replace(/\D/g, "")) || form.km })
                    }
                  />
                  <Field
                    label="Maintenance type"
                    value={form.maintenanceType}
                    onChange={(v) => setForm({ ...form, maintenanceType: v })}
                  />
                  <div className="space-y-1">
                    <Label className="text-xs">Department</Label>
                    <Select
                      value={form.department}
                      onValueChange={(v) => setForm({ ...form, department: v as Department })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Priority</Label>
                    <Select
                      value={form.priority}
                      onValueChange={(v) => setForm({ ...form, priority: v as Priority })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Field
                    label="Duration (hours)"
                    value={String(form.duration)}
                    onChange={(v) => setForm({ ...form, duration: Number(v) || 0 })}
                  />
                  <Field
                    label="Required date"
                    value={form.requiredDate}
                    onChange={(v) => setForm({ ...form, requiredDate: v })}
                  />
                  <Field
                    label="Required resources (comma separated)"
                    value={form.resources.join(", ")}
                    onChange={(v) =>
                      setForm({ ...form, resources: v.split(",").map((s) => s.trim()).filter(Boolean) })
                    }
                  />
                </div>
                <DialogFooter>
                  <Button onClick={submit}>{editing ? "Save changes" : "Add task"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Maintenance type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs font-semibold">{t.taskId}</TableCell>
                  <TableCell className="font-mono text-xs">{t.assetId}</TableCell>
                  <TableCell>{t.location}</TableCell>
                  <TableCell>{t.department}</TableCell>
                  <TableCell className="max-w-56 truncate text-muted-foreground">
                    {t.maintenanceType}
                  </TableCell>
                  <TableCell>{t.duration} h</TableCell>
                  <TableCell>
                    <StatusPill tone={priorityTone(t.priority)}>{t.priority}</StatusPill>
                  </TableCell>
                  <TableCell className="text-xs">{t.requiredDate}</TableCell>
                  <TableCell className="max-w-48 truncate text-xs text-muted-foreground">
                    {t.resources.join(", ")}
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={t.status === "Pending" ? "neutral" : "info"}>{t.status}</StatusPill>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Edit task"
                      onClick={() => {
                        setEditing(t);
                        const { id: _id, ...rest } = t;
                        setForm(rest);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete task"
                      onClick={() => {
                        deleteTask(t.id);
                        toast.success(`Task ${t.taskId} removed`);
                      }}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
