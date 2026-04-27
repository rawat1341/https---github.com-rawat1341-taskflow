import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, ListTodo, Loader2 } from "lucide-react";
import { Task } from "@/lib/types";

interface Props {
  tasks: Task[];
}

export function StatsGrid({ tasks }: Props) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const inProgress = tasks.filter((t) => t.status === "In progress").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;

  const cards = [
    {
      label: "Total Tasks",
      value: total,
      icon: ListTodo,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Loader2,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card
          key={c.label}
          className="p-5 shadow-card-soft border-border/60 hover:shadow-elegant transition-smooth"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                {c.label}
              </p>
              <p className="text-3xl font-bold mt-1 tracking-tight">
                {c.value}
              </p>
            </div>
            <div
              className={`h-10 w-10 rounded-lg ${c.bg} flex items-center justify-center`}
            >
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
