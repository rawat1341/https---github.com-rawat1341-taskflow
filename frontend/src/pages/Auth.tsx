import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, signupSchema } from "@/lib/validation";

const Auth = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, login, signup } = useAuth();

  const mode = params.get("mode") === "signup" ? "signup" : "login";
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const switchMode = (m: "login" | "signup") => {
    setParams({ mode: m });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const parsed = signupSchema.safeParse({ username, email, password });
        if (!parsed.success) {
          toast.error(parsed.error.errors[0].message);
          return;
        }
        await signup(
          parsed.data.username,
          parsed.data.email,
          parsed.data.password,
        );
        toast.success("Account created");
      } else {
        const parsed = loginSchema.safeParse({ email, password });
        if (!parsed.success) {
          toast.error(parsed.error.errors[0].message);
          return;
        }
        await login(parsed.data.email, parsed.data.password);
        toast.success("Welcome back");
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setEmail("demo@taskmanager.com");
    setPassword("Demo@123");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <header className="container flex items-center justify-between py-5">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md p-8 shadow-elegant border-border/60 animate-scale-in">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back home
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signup"
              ? "Start organizing your tasks in seconds"
              : "Log in to continue to TaskFlow"}
          </p>

          {mode === "login" && (
            <button
              type="button"
              onClick={fillDemo}
              className="mt-4 w-full text-left text-xs px-3 py-2 rounded-lg bg-secondary text-secondary-foreground border border-primary/20 hover:border-primary/40 transition-smooth"
            >
              <span className="font-semibold">Use demo credentials →</span>{" "}
              demo@taskmanager.com / Demo@123
            </button>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  autoComplete="username"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
              />
              {mode === "signup" && (
                <p className="text-xs text-muted-foreground">
                  Min 6 chars · upper, lower, number & special (@$!%*?&)
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-primary shadow-elegant hover:shadow-glow transition-smooth"
              size="lg"
            >
              {submitting
                ? "Please wait..."
                : mode === "signup"
                  ? "Create account"
                  : "Log in"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            {mode === "signup"
              ? "Already have an account?"
              : "New to TaskFlow?"}{" "}
            <button
              onClick={() => switchMode(mode === "signup" ? "login" : "signup")}
              className="text-primary font-semibold hover:underline"
            >
              {mode === "signup" ? "Log in" : "Sign up"}
            </button>
          </p>
        </Card>
      </main>
    </div>
  );
};

export default Auth;
