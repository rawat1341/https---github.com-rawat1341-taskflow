import { CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-elegant group-hover:shadow-glow transition-smooth">
        <CheckSquare
          className="h-5 w-5 text-primary-foreground"
          strokeWidth={2.5}
        />
      </div>
      <span className="text-xl font-bold tracking-tight">
        Task<span className="text-primary">Flow</span>
      </span>
    </Link>
  );
}
