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
    <div className="flex min-h-screen bg-[hsl(var(--background))]">
      {/* Sidebar - dark glass vibe */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col fixed inset-y-0 left-0 z-30">
        <NavLink to="/" className="flex items-center gap-2.5 px-6 py-5 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#ff7e00] to-[#ff4b00] flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-display font-bold tracking-tight text-foreground">
            Tradle <span className="gradient-text">AI</span>
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-orange-500/15 text-orange-400 border border-orange-500/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-border">
          <div className="glass-card p-3 text-center rounded-xl">
            <p className="text-xs text-muted-foreground">Platform Status</p>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">Operational</span>
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
