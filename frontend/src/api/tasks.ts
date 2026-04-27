import { Task, TaskStatus, PriorityType } from "@/lib/types";
import { http, USE_MOCK } from "./client";
import { getCurrentUser } from "./auth";

const TASKS_KEY = "tm_tasks";

function readTasks(): Task[] {
  try {
    return JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function normalizePriority(v: string): PriorityType {
  const n = v.toLowerCase();
  return (n.charAt(0).toUpperCase() + n.slice(1)) as PriorityType;
}

export async function getTasks(): Promise<Task[]> {
  if (!USE_MOCK) return http<Task[]>("/tasks/get");
  const user = getCurrentUser();
  if (!user) return [];
  return readTasks()
    .filter((t) => t.userId === user._id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export async function createTask(input: {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priorityType?: PriorityType;
}): Promise<Task> {
  const title = (input.title || "").trim();
  if (!title) throw new Error("Title is required");
  if (!USE_MOCK) {
    return http<Task>("/tasks/create", {
      method: "POST",
      body: JSON.stringify({ ...input, title }),
    });
  }
  const user = getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  const now = new Date().toISOString();
  const task: Task = {
    _id: crypto.randomUUID(),
    title,
    description: input.description?.trim() || "",
    status: input.status || "Pending",
    priorityType: normalizePriority(input.priorityType || "Personal"),
    userId: user._id,
    createdAt: now,
    updatedAt: now,
  };
  const all = readTasks();
  all.push(task);
  writeTasks(all);
  return task;
}

export async function updateTaskStatus(
  id: string,
  status: TaskStatus,
): Promise<Task> {
  if (!USE_MOCK) {
    return http<Task>(`/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }
  const all = readTasks();
  const idx = all.findIndex((t) => t._id === id);
  if (idx === -1) throw new Error("Task not found");
  all[idx] = { ...all[idx], status, updatedAt: new Date().toISOString() };
  writeTasks(all);
  return all[idx];
}

export async function deleteTask(id: string): Promise<void> {
  if (!USE_MOCK) {
    await http<{ ok: true }>(`/tasks/delete/${id}`, { method: "DELETE" });
    return;
  }
  writeTasks(readTasks().filter((t) => t._id !== id));
}
