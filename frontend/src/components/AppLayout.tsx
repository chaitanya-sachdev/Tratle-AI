import { NavLink, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, Wand2, BarChart3, FlaskConical, FileText, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/wizard", label: "Data Ingestion", icon: Wand2 },
  { to: "/dashboard", label: "Analysis", icon: BarChart3 },
  { to: "/simulator", label: "Simulator", icon: FlaskConical },
  { to: "/report", label: "Report", icon: FileText },
];

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col fixed inset-y-0 left-0 z-30">
        <NavLink to="/" className="flex items-center gap-2.5 px-6 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Globe className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Tradle <span className="glow-text-purple">AI</span>
          </span>
        </NavLink>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-border">
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Platform Status</p>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
              <span className="text-xs font-medium text-success">Operational</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
