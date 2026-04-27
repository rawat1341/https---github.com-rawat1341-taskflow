import { Briefcase, Home, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Task, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const statusStyles: Record<TaskStatus, string> = {
  Pending: "bg-warning/15 text-warning border-warning/30",
  "In progress": "bg-accent/15 text-accent border-accent/30",
  Completed: "bg-success/15 text-success border-success/30",
};

export function TaskCard({ task, onStatusChange, onDelete }: Props) {
  const PriorityIcon = task.priorityType === "Professional" ? Briefcase : Home;

  return (
    <Card className="p-5 shadow-card-soft border-border/60 hover:shadow-elegant hover:-translate-y-0.5 transition-smooth flex flex-col gap-3 animate-scale-in">
      <div className="flex items-start justify-between gap-2">
        <h3
          className={cn(
            "font-semibold leading-tight line-clamp-2",
            task.status === "Completed" && "line-through text-muted-foreground",
          )}
        >
          {task.title}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 -mt-1 -mr-1 text-muted-foreground hover:text-destructive shrink-0"
          onClick={() => onDelete(task._id)}
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {task.description && (
        <p className="text-sm text-muted-foreground line-clamp-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mt-auto pt-2">
        <span
          className={cn(
            "text-xs px-2.5 py-1 rounded-full border font-medium",
            statusStyles[task.status],
          )}
        >
          {task.status}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium flex items-center gap-1">
          <PriorityIcon className="h-3 w-3" />
          {task.priorityType}
        </span>
      </div>

      <Select
        value={task.status}
        onValueChange={(v) => onStatusChange(task._id, v as TaskStatus)}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="In progress">In progress</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </Card>
  );
}
