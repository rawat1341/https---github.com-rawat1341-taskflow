import { AuthResponse, User } from "@/lib/types";
import { http, tokenStorage, USE_MOCK } from "./client";

const USERS_KEY = "tm_users";
const CURRENT_USER_KEY = "tm_current_user";

interface StoredUser extends User {
  password: string;
}

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeUsername(value: string) {
  if (!value) return value;
  const v = value.toLowerCase();
  return v.charAt(0).toUpperCase() + v.slice(1);
}

/** Seed a default demo account if none exists */
export function seedDemoAccount() {
  if (USE_MOCK) {
    const users = readUsers();
    if (!users.some((u) => u.email === "demo@taskmanager.com")) {
      users.push({
        _id: "demo-user-id",
        username: "Demo",
        email: "demo@taskmanager.com",
        password: "Demo@123",
      });
      writeUsers(users);
    }
  }
}

export async function signup(input: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  if (!USE_MOCK) {
    const data = await http<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    });
    if (data.token) tokenStorage.set(data.token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
    return data;
  }
  const users = readUsers();
  const email = input.email.toLowerCase().trim();
  if (users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists");
  }
  const newUser: StoredUser = {
    _id: crypto.randomUUID(),
    username: normalizeUsername(input.username.trim()),
    email,
    password: input.password,
  };
  users.push(newUser);
  writeUsers(users);
  const { password: _p, ...publicUser } = newUser;
  const token = `mock-${newUser._id}`;
  tokenStorage.set(token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));
  return { user: publicUser, token };
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  if (!USE_MOCK) {
    const data = await http<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
    if (data.token) tokenStorage.set(data.token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
    return data;
  }
  const users = readUsers();
  const email = input.email.toLowerCase().trim();
  const user = users.find(
    (u) => u.email === email && u.password === input.password,
  );
  if (!user) throw new Error("Invalid email or password");
  const { password: _p, ...publicUser } = user;
  const token = `mock-${user._id}`;
  tokenStorage.set(token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));
  return { user: publicUser, token };
}

export async function logout(): Promise<void> {
  if (!USE_MOCK) {
    try {
      await http<{ ok: true }>("/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
  }
  tokenStorage.clear();
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}
