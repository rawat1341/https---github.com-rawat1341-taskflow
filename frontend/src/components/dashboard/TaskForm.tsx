import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { createTask } from "@/api/tasks";
import { createTaskSchema } from "@/lib/validation";
import { PriorityType, Task, TaskStatus } from "@/lib/types";

interface Props {
  onCreated: (task: Task) => void;
}

export function TaskForm({ onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Pending");
  const [priorityType, setPriorityType] = useState<PriorityType>("Personal");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = createTaskSchema.safeParse({
      title,
      description,
      status,
      priorityType,
    });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    try {
      const task = await createTask(parsed.data);
      onCreated(task);
      setTitle("");
      setDescription("");
      setStatus("Pending");
      setPriorityType("Personal");
      toast.success("Task created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6 shadow-card-soft border-border/60 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Plus className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold leading-tight">
            Add a new task
          </h2>
          <p className="text-sm text-muted-foreground">
            Fill the details and execute
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Finish quarterly report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">
              Description{" "}
              <span className="text-muted-foreground font-normal">
                ({description.length}/100)
              </span>
            </Label>
            <Textarea
              id="description"
              placeholder="Optional notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={100}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as TaskStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In progress">In progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={priorityType}
              onValueChange={(v) => setPriorityType(v as PriorityType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          type="submit"
          disabled={submitting}
          className="w-full md:w-auto bg-gradient-primary hover:opacity-90 shadow-elegant transition-smooth"
          size="lg"
        >
          {submitting ? "Adding..." : "Execute · Add Task"}
        </Button>
      </form>
    </Card>
  );
}
