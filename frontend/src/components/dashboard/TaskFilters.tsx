import { Briefcase, Home, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriorityType, TaskStatus } from "@/lib/types";

export type StatusFilter = "All" | TaskStatus;
export type TypeFilter = "All" | PriorityType;

interface Props {
  status: StatusFilter;
  type: TypeFilter;
  onStatusChange: (s: StatusFilter) => void;
  onTypeChange: (t: TypeFilter) => void;
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "In progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

const typeOptions: { value: TypeFilter; label: string; icon: typeof Home }[] = [
  { value: "All", label: "Both", icon: ListFilter },
  { value: "Personal", label: "Personal", icon: Home },
  { value: "Professional", label: "Professional", icon: Briefcase },
];

export function TaskFilters({
  status,
  type,
  onStatusChange,
  onTypeChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((o) => (
          <button
            key={o.value}
            onClick={() => onStatusChange(o.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-smooth",
              status === o.value
                ? "bg-primary text-primary-foreground border-primary shadow-elegant"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {typeOptions.map((o) => (
          <button
            key={o.value}
            onClick={() => onTypeChange(o.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium border transition-smooth flex items-center gap-1.5",
              type === o.value
                ? "bg-secondary text-secondary-foreground border-primary/40"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40",
            )}
          >
            <o.icon className="h-3.5 w-3.5" />
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
