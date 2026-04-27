export type TaskStatus = "Pending" | "In progress" | "Completed";
export type PriorityType = "Professional" | "Personal";

export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priorityType: PriorityType;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}
