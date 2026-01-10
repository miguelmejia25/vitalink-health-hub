import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BLEProvider } from "@/contexts/BLEContext";
import {BottomNav} from "@/components/BottomNav";
import Index from "./pages/Index";
import Vitals from "./pages/Vitals";
import Messages from "./pages/Messages";
import Symptoms from "./pages/Symptoms";
import Doctor from "./pages/Doctor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BLEProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen flex-col bg-background pb-20">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/vitals" element={<Vitals />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/symptoms" element={<Symptoms />} />
              <Route path="/doctor" element={<Doctor />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </BLEProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;