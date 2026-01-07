import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

export function Layout() {
  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <Header userName="Sarah" />
      <Outlet />
      <BottomNav />
    </div>
  );
}
