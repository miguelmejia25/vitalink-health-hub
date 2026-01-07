import { VitalCard } from "@/components/VitalCard";
import { Droplets, Heart, Thermometer, TrendingUp } from "lucide-react";

const vitalHistory = [
  { time: "8:00 AM", heart: 68, oxygen: 98, temp: 36.4 },
  { time: "10:00 AM", heart: 72, oxygen: 97, temp: 36.5 },
  { time: "12:00 PM", heart: 75, oxygen: 98, temp: 36.6 },
  { time: "2:00 PM", heart: 70, oxygen: 99, temp: 36.5 },
  { time: "4:00 PM", heart: 72, oxygen: 98, temp: 36.6 },
];

export default function Vitals() {
  return (
    <main className="container py-6">
      {/* Current Vitals */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Current Readings
        </h2>
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
            trend="up"
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

      {/* History */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Today's History</h2>
        </div>
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    <span className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-heart" />
                      Heart
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    <span className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-oxygen" />
                      O₂
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    <span className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-temp" />
                      Temp
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {vitalHistory.map((reading, index) => (
                  <tr
                    key={reading.time}
                    className={
                      index !== vitalHistory.length - 1
                        ? "border-b border-border"
                        : ""
                    }
                  >
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {reading.time}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {reading.heart} bpm
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {reading.oxygen}%
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {reading.temp}°C
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Daily Statistics
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-heart/10">
              <Heart className="h-6 w-6 text-heart" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Heart Rate</p>
              <p className="text-xl font-bold text-foreground">71 bpm</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-oxygen/10">
              <Droplets className="h-6 w-6 text-oxygen" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Oxygen</p>
              <p className="text-xl font-bold text-foreground">98%</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-temp/10">
              <Thermometer className="h-6 w-6 text-temp" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Temperature</p>
              <p className="text-xl font-bold text-foreground">36.5°C</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
