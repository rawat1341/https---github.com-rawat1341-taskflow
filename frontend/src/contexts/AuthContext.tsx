import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@/lib/types";
import {
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout,
  seedDemoAccount,
  signup as apiSignup,
} from "@/api/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedDemoAccount();
    setUser(getCurrentUser());
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    setUser(res.user);
  };

  const signup = async (username: string, email: string, password: string) => {
    const res = await apiSignup({ username, email, password });
    setUser(res.user);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
