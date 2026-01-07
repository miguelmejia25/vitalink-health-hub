import { cn } from "@/lib/utils";
import { Activity, ClipboardList, Home, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Activity, label: "Vitals", href: "/vitals" },
  { icon: ClipboardList, label: "Log", href: "/symptoms" },
  { icon: MessageCircle, label: "Chat", href: "/messages" },
  { icon: User, label: "Doctor", href: "/doctor" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg lg:hidden">
      <div className="container">
        <ul className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn("h-5 w-5", isActive && "animate-scale-in")}
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
