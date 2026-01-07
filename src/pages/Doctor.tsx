import { ActionButton } from "@/components/ActionButton";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import {
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Doctor() {
  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <Header userName="Sarah" />

      <main className="container py-6">
        {/* Doctor Profile */}
        <section className="mb-8">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-md">
            <div className="relative h-24 gradient-primary">
              <div className="absolute -bottom-12 left-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-card bg-primary text-3xl font-bold text-primary-foreground shadow-lg">
                  EC
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 pt-16">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Dr. Emily Chen
                  </h2>
                  <p className="text-muted-foreground">Cardiologist</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-warning/10 px-3 py-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="text-sm font-semibold text-warning">4.9</span>
                </div>
              </div>

              <div className="mb-6 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>City Medical Center, Floor 3</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Available: Mon-Fri, 9 AM - 5 PM</span>
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid gap-3 sm:grid-cols-3">
                <Link to="/messages" className="block">
                  <button className="flex w-full flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition-all hover:bg-muted hover:shadow-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                      <MessageCircle className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      Message
                    </span>
                  </button>
                </Link>
                <button className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition-all hover:bg-muted hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success">
                    <Phone className="h-5 w-5 text-success-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Call</span>
                </button>
                <button className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition-all hover:bg-muted hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-oxygen">
                    <Video className="h-5 w-5 text-oxygen-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Video
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Appointment */}
        <section className="mb-8">
          <h3 className="mb-4 text-lg font-bold text-foreground">
            Upcoming Appointment
          </h3>
          <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-primary/10">
                <span className="text-lg font-bold text-primary">15</span>
                <span className="text-xs font-medium text-primary">Jan</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">
                  Follow-up Consultation
                </h4>
                <p className="text-sm text-muted-foreground">
                  Wednesday, 10:00 AM • Video Call
                </p>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </section>

        {/* Doctor Dashboard */}
        <section className="mb-8">
          <h3 className="mb-4 text-lg font-bold text-foreground">
            Healthcare Portal
          </h3>
          <ActionButton
            icon={<ExternalLink className="h-5 w-5 text-primary-foreground" />}
            label="Doctor Dashboard"
            sublabel="Access full patient management portal"
            variant="primary"
          />
        </section>

        {/* Medical Records */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-foreground">
            Shared Records
          </h3>
          <div className="space-y-3">
            {[
              { title: "Lab Results - Jan 8", type: "PDF" },
              { title: "ECG Report - Jan 2", type: "PDF" },
              { title: "Prescription - Dec 28", type: "Doc" },
            ].map((record) => (
              <div
                key={record.title}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-muted"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{record.title}</p>
                  <p className="text-sm text-muted-foreground">{record.type}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
