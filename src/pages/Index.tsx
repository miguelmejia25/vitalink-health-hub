import { ActionButton } from "@/components/ActionButton";
import { SymptomLogger } from "@/components/SymptomLogger";
import { VitalCard } from "@/components/VitalCard";
import {
  Activity,
  AlertTriangle,
  Droplets,
  ExternalLink,
  Heart,
  MessageCircle,
  Phone,
  Thermometer,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <main className="container py-6">
      {/* Vitals Section */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Your Vitals</h2>
          <span className="text-sm text-muted-foreground">
            Last updated: 2 min ago
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <VitalCard
            title="Heart Rate"
            value={72}
            unit="bpm"
            icon={<Heart className="h-6 w-6 text-white" />}
            variant="heart"
            status="normal"
            trend="stable"
          />
          <VitalCard
            title="Oxygen Level"
            value={98}
            unit="%"
            icon={<Droplets className="h-6 w-6 text-white" />}
            variant="oxygen"
            status="normal"
            trend="stable"
          />
          <VitalCard
            title="Temperature"
            value={36.6}
            unit="°C"
            icon={<Thermometer className="h-6 w-6 text-white" />}
            variant="temp"
            status="normal"
            trend="stable"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/doctor">
            <ActionButton
              icon={<MessageCircle className="h-5 w-5 text-primary-foreground" />}
              label="Contact Doctor"
              sublabel="Dr. Emily Chen • Cardiologist"
              variant="primary"
            />
          </Link>
          <ActionButton
            icon={<Phone className="h-5 w-5 text-emergency-foreground" />}
            label="Emergency Contact"
            sublabel="John Smith • (555) 123-4567"
            variant="emergency"
          />
        </div>
      </section>

      {/* Doctor Dashboard Gateway */}
      <section className="mb-8">
        <div className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-vital">
              <Activity className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">
                Doctor Dashboard
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Access the web portal for healthcare providers to view patient
                data and manage care plans.
              </p>
              <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:shadow-vital">
                Open Dashboard
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Symptom Logger */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h2 className="text-lg font-bold text-foreground">Log Symptoms</h2>
        </div>
        <div className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-md">
          <SymptomLogger />
        </div>
      </section>
    </main>
  );
}
