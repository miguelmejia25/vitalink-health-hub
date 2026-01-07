import { Bell, Menu } from "lucide-react";
import { useState } from "react";
import { MobileNav } from "./MobileNav";

interface HeaderProps {
  userName?: string;
}

export function Header({ userName = "Sarah" }: HeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <header className="sticky top-0 z-40 glass-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted transition-colors hover:bg-accent lg:hidden"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
            <div>
              <p className="text-sm text-muted-foreground">{greeting}</p>
              <h1 className="text-xl font-bold text-foreground">{userName}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-muted transition-colors hover:bg-accent">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emergency text-xs font-bold text-emergency-foreground">
                2
              </span>
            </button>
            <div className="h-10 w-10 overflow-hidden rounded-xl bg-primary">
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-primary-foreground">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
