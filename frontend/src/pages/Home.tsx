import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="container flex items-center justify-between py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Button asChild className="bg-gradient-primary shadow-elegant">
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-1.5" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/auth?mode=login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-primary shadow-elegant">
                <Link to="/auth?mode=signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="container pt-12 pb-20 lg:pt-24">
        <section className="max-w-3xl mx-auto text-center animate-fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Stay focused. Get things done.
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            Your day,{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              perfectly organized
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            A beautifully simple task manager that separates your personal life
            from professional work — so nothing slips through the cracks.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <Button
                asChild
                size="lg"
                className="bg-gradient-primary shadow-elegant hover:shadow-glow transition-smooth"
              >
                <Link to="/dashboard">
                  Go to Dashboard <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-primary shadow-elegant hover:shadow-glow transition-smooth"
                >
                  <Link to="/auth?mode=signup">
                    Get started free <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/auth?mode=login">I have an account</Link>
                </Button>
              </>
            )}
          </div>

          {!user && (
            <p className="mt-6 text-xs text-muted-foreground">
              Try the demo:{" "}
              <code className="px-2 py-0.5 rounded bg-muted text-foreground font-mono">
                demo@taskmanager.com
              </code>{" "}
              /{" "}
              <code className="px-2 py-0.5 rounded bg-muted text-foreground font-mono">
                Demo@123
              </code>
            </p>
          )}
        </section>

        <section className="mt-24 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: Zap,
              title: "Lightning fast",
              text: "Add, update and complete tasks in a single click — no friction.",
            },
            {
              icon: CheckCircle2,
              title: "Smart filters",
              text: "Filter by status or split personal vs. professional work.",
            },
            {
              icon: LayoutDashboard,
              title: "Live dashboard",
              text: "Real-time stats keep you on top of your progress.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl border border-border/60 bg-card shadow-card-soft hover:shadow-elegant transition-smooth"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;
