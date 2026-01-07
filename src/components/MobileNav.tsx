import { cn } from "@/lib/utils";
import {
  Activity,
  ClipboardList,
  Home,
  MessageCircle,
  Settings,
  User,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Activity, label: "Vitals", href: "/vitals" },
  { icon: ClipboardList, label: "Symptoms", href: "/symptoms" },
  { icon: MessageCircle, label: "Messages", href: "/messages" },
  { icon: User, label: "Doctor", href: "/doctor" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function MobileNav({ open, onClose }: MobileNavProps) {
  const location = useLocation();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card shadow-lg transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">VitalLink</span>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <p className="text-center text-xs text-muted-foreground">
              VitalLink v1.0 • Your Health, Connected
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
