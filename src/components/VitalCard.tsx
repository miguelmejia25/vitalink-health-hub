import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: ReactNode;
  variant: "heart" | "oxygen" | "temp";
  trend?: "up" | "down" | "stable";
  status?: "normal" | "warning" | "critical";
  className?: string;
}

const variantStyles = {
  heart: {
    gradient: "gradient-heart",
    shadow: "shadow-heart",
    animation: "animate-heartbeat",
  },
  oxygen: {
    gradient: "gradient-oxygen",
    shadow: "shadow-oxygen",
    animation: "animate-pulse-subtle",
  },
  temp: {
    gradient: "gradient-temp",
    shadow: "shadow-temp",
    animation: "animate-float",
  },
};

const statusBadge = {
  normal: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
  critical: "bg-emergency/20 text-emergency",
};

export function VitalCard({
  title,
  value,
  unit,
  icon,
  variant,
  trend = "stable",
  status = "normal",
  className,
}: VitalCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02]",
        styles.gradient,
        styles.shadow,
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20",
              styles.animation
            )}
          >
            {icon}
          </div>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium capitalize",
              statusBadge[status]
            )}
          >
            {status}
          </span>
        </div>

        {/* Value */}
        <div className="mt-6">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">{value}</span>
            <span className="text-lg font-medium text-white/70">{unit}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-white/80">{title}</p>
        </div>

        {/* Trend indicator */}
        <div className="mt-4 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white/60 transition-all duration-1000"
              style={{ width: status === "normal" ? "75%" : status === "warning" ? "50%" : "25%" }}
            />
          </div>
          <span className="text-xs text-white/60">
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        </div>
      </div>
    </div>
  );
}
