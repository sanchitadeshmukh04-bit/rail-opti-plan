import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRail } from "@/lib/rail/store";
import type { Train } from "@/lib/rail/types";

export const Route = createFileRoute("/trains")({
  head: () => ({
    meta: [
      { title: "Train Schedule | RailOpt AI Block Planner" },
      {
        name: "description",
        content:
          "Manage the section train timetable used by the block planner to detect maintenance conflicts.",
      },
      { property: "og:title", content: "Train Schedule | RailOpt AI" },
      {
        property: "og:description",
        content: "Timetable of protected train movements across the Igatpuri–Kalyan section.",
      },
    ],
  }),
  component: TrainsPage,
});

const empty = {
  trainId: "",
  name: "",
  route: "",
  location: "KM 120",
  km: 120,
  arrival: "10:00",
  departure: "10:05",
  type: "Express",
  priority: "Medium",
  status: "On Time",
} as Omit<Train, "id">;

function TrainsPage() {
  const { trains, addTrain, updateTrain, deleteTrain } = useRail();
  const [q, setQ] = useState("");
  const [sortByKm, setSortByKm] = useState(false);
  const [editing, setEditing] = useState<Train | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const rows = useMemo(() => {
    const filtered = trains.filter((t) =>
      `${t.trainId} ${t.name} ${t.route} ${t.location} ${t.type}`.toLowerCase().includes(q.toLowerCase()),
    );
    return sortByKm ? [...filtered].sort((a, b) => a.km - b.km) : filtered;
  }, [trains, q, sortByKm]);

  const submit = () => {
    if (!form.trainId || !form.name) {
      toast.error("Train number and name are required");
      return;
    }
    if (editing) {
      updateTrain(editing.id, form);
      toast.success(`Train ${form.trainId} updated`);
    } else {
      addTrain(form);
      toast.success(`Train ${form.trainId} added to the timetable`);
    }
    setOpen(false);
    setEditing(null);
    setForm(empty);
  };

  return (
    <AppShell title="Train Schedule" subtitle="Protected train movements used for conflict detection">
      <SectionCard
        title={`${rows.length} scheduled movements`}
        description="The block planner treats these as protected movements"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search train, route, KM"
                className="w-56 pl-8"
              />
            </div>
            <Button variant="outline" onClick={() => setSortByKm((s) => !s)}>
              Sort: {sortByKm ? "Location" : "Default"}
            </Button>
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
                  <Plus className="size-4" /> Add Train
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editing ? "Edit train" : "Add train"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["trainId", "Train number"],
                      ["name", "Train name"],
                      ["route", "Route"],
                      ["location", "Location"],
                      ["arrival", "Arrival (HH:MM)"],
                      ["departure", "Departure (HH:MM)"],
                      ["type", "Type"],
                      ["priority", "Priority"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs">{label}</Label>
                      <Input
                        value={String(form[key])}
                        onChange={(e) => {
                          const value = e.target.value;
                          setForm((f) => ({
                            ...f,
                            [key]: value,
                            ...(key === "location"
                              ? { km: Number(value.replace(/\D/g, "")) || f.km }
                              : {}),
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button onClick={submit}>{editing ? "Save changes" : "Add train"}</Button>
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
                <TableHead>Train ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs font-semibold">{t.trainId}</TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell className="text-muted-foreground">{t.route}</TableCell>
                  <TableCell>{t.location}</TableCell>
                  <TableCell className="font-mono text-xs">{t.arrival}</TableCell>
                  <TableCell className="font-mono text-xs">{t.departure}</TableCell>
                  <TableCell>{t.type}</TableCell>
                  <TableCell>
                    <StatusPill tone={priorityTone(t.priority)}>{t.priority}</StatusPill>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={t.status === "On Time" ? "success" : "warning"}>
                      {t.status}
                    </StatusPill>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Edit train"
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
                      aria-label="Delete train"
                      onClick={() => {
                        deleteTrain(t.id);
                        toast.success(`Train ${t.trainId} removed`);
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
