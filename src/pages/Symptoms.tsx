import { SymptomLogger } from "@/components/SymptomLogger";
import { cn } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";

const symptomHistory = [
  {
    id: 1,
    date: "Today",
    time: "10:30 AM",
    symptoms: ["Headache", "Fatigue"],
    severity: "Mild",
    notes: "Started after morning meeting",
  },
  {
    id: 2,
    date: "Yesterday",
    time: "3:15 PM",
    symptoms: ["Dizziness"],
    severity: "Moderate",
    notes: "Lasted about 20 minutes",
  },
  {
    id: 3,
    date: "Jan 5",
    time: "8:00 AM",
    symptoms: ["Nausea", "Loss of appetite"],
    severity: "Mild",
    notes: "",
  },
];

const severityColors = {
  Mild: "bg-success/10 text-success",
  Moderate: "bg-warning/10 text-warning",
  Severe: "bg-emergency/10 text-emergency",
};

export default function Symptoms() {
  return (
    <main className="container py-6">
      {/* Symptom Logger */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Log New Symptoms
        </h2>
        <div className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-md">
          <SymptomLogger />
        </div>
      </section>

      {/* History */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Recent Logs</h2>
        </div>
        <div className="space-y-4">
          {symptomHistory.map((log) => (
            <div
              key={log.id}
              className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{log.date}</span>
                  <span>•</span>
                  <span>{log.time}</span>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    severityColors[log.severity as keyof typeof severityColors]
                  )}
                >
                  {log.severity}
                </span>
              </div>
              <div className="mb-2 flex flex-wrap gap-2">
                {log.symptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
              {log.notes && (
                <p className="text-sm text-muted-foreground">{log.notes}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
