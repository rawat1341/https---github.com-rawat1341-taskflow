import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Task, TaskStatus } from "@/lib/types";
import {
  deleteTask as apiDeleteTask,
  getTasks,
  updateTaskStatus,
} from "@/api/tasks";
import { TaskForm } from "@/components/dashboard/TaskForm";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import {
  StatusFilter,
  TaskFilters,
  TypeFilter,
} from "@/components/dashboard/TaskFilters";
import { TaskCard } from "@/components/dashboard/TaskCard";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((e) =>
        toast.error(e instanceof Error ? e.message : "Failed to load tasks"),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    try {
      const updated = await updateTaskStatus(id, status);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter !== "All" && t.status !== statusFilter) return false;
      if (typeFilter !== "All" && t.priorityType !== typeFilter) return false;
      return true;
    });
  }, [tasks, statusFilter, typeFilter]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border/60 bg-card/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between py-4">
          <Logo />
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold leading-tight">
                {user?.username}
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                {user?.email}
              </span>
            </div>
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hello, {user?.username} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's a quick overview of your tasks today.
          </p>
        </div>

        <TaskForm onCreated={(task) => setTasks((prev) => [task, ...prev])} />

        <StatsGrid tasks={tasks} />

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Your tasks</h2>
            <span className="text-sm text-muted-foreground">
              {filtered.length} of {tasks.length}
            </span>
          </div>

          <TaskFilters
            status={statusFilter}
            type={typeFilter}
            onStatusChange={setStatusFilter}
            onTypeChange={setTypeFilter}
          />

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-44 rounded-xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center">
              <div className="h-14 w-14 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <Inbox className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-semibold">No tasks here yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                {tasks.length === 0
                  ? "Add your first task using the form above."
                  : "Try changing the filters."}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
