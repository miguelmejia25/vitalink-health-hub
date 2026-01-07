import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";

const commonSymptoms = [
  "Headache",
  "Fatigue",
  "Nausea",
  "Dizziness",
  "Chest pain",
  "Shortness of breath",
  "Fever",
  "Cough",
  "Body aches",
  "Loss of appetite",
];

const severityLevels = [
  { value: 1, label: "Mild", color: "bg-success" },
  { value: 2, label: "Moderate", color: "bg-warning" },
  { value: 3, label: "Severe", color: "bg-emergency" },
];

export function SymptomLogger() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<number>(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Symptoms logged successfully", {
      description: "Your doctor will be notified.",
    });
    
    setSelectedSymptoms([]);
    setSeverity(1);
    setNotes("");
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Symptom chips */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Select symptoms
        </h3>
        <div className="flex flex-wrap gap-2">
          {commonSymptoms.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom);
            return (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-vital"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {isSelected && <Check className="h-4 w-4" />}
                {symptom}
              </button>
            );
          })}
          <button className="flex items-center gap-2 rounded-full border-2 border-dashed border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <Plus className="h-4 w-4" />
            Other
          </button>
        </div>
      </div>

      {/* Severity */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Severity level
        </h3>
        <div className="flex gap-3">
          {severityLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => setSeverity(level.value)}
              className={cn(
                "flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all duration-200",
                severity === level.value
                  ? "border-primary bg-primary/5 shadow-vital"
                  : "border-border bg-card hover:border-muted-foreground"
              )}
            >
              <div
                className={cn("h-4 w-4 rounded-full", level.color)}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  severity === level.value
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {level.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Additional notes
        </h3>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe your symptoms in more detail..."
          className="min-h-[100px] resize-none rounded-2xl border-border bg-card"
        />
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || selectedSymptoms.length === 0}
        className="w-full rounded-2xl py-6 text-base font-semibold gradient-primary shadow-vital transition-all hover:shadow-lg disabled:opacity-50"
      >
        {isSubmitting ? "Logging..." : "Log Symptoms"}
      </Button>
    </div>
  );
}
