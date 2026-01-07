import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Send, User } from "lucide-react";
import { useState } from "react";

const mockMessages = [
  {
    id: 1,
    sender: "doctor",
    message: "Good morning Sarah! How are you feeling today?",
    time: "9:00 AM",
  },
  {
    id: 2,
    sender: "patient",
    message: "Hi Dr. Chen! I'm feeling much better. The new medication seems to be working.",
    time: "9:15 AM",
  },
  {
    id: 3,
    sender: "doctor",
    message: "That's great to hear! Your vitals are looking stable too. Keep monitoring and let me know if anything changes.",
    time: "9:20 AM",
  },
  {
    id: 4,
    sender: "patient",
    message: "Will do! Thank you for checking in.",
    time: "9:22 AM",
  },
];

export default function Messages() {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send to backend
    setNewMessage("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24 lg:pb-8">
      <Header userName="Sarah" />

      <main className="container flex flex-1 flex-col py-6">
        {/* Doctor Info */}
        <div className="mb-4 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary">
            <User className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Dr. Emily Chen</h2>
            <p className="text-sm text-muted-foreground">Cardiologist • Online</p>
          </div>
          <div className="ml-auto h-3 w-3 rounded-full bg-success" />
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-border bg-card p-4 shadow-md">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.sender === "patient" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  msg.sender === "patient"
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                <p className="text-sm">{msg.message}</p>
                <p
                  className={cn(
                    "mt-1 text-xs",
                    msg.sender === "patient"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="mt-4 flex gap-3">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="min-h-[50px] max-h-[100px] resize-none rounded-2xl border-border bg-card"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            className="h-auto rounded-2xl gradient-primary px-4 shadow-vital"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
