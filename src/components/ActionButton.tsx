import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  sublabel?: string;
  variant: "primary" | "emergency" | "secondary";
  onClick?: () => void;
  className?: string;
}

const variantStyles = {
  primary: "gradient-primary shadow-vital hover:shadow-lg text-primary-foreground",
  emergency: "gradient-emergency shadow-emergency hover:shadow-lg text-emergency-foreground",
  secondary: "bg-card shadow-md hover:shadow-lg text-foreground border border-border",
};

export function ActionButton({
  icon,
  label,
  sublabel,
  variant,
  onClick,
  className,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
        variantStyles[variant],
        className
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          variant === "secondary" ? "bg-muted" : "bg-white/20"
        )}
      >
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold">{label}</p>
        {sublabel && (
          <p
            className={cn(
              "text-sm",
              variant === "secondary" ? "text-muted-foreground" : "opacity-80"
            )}
          >
            {sublabel}
          </p>
        )}
      </div>
      <svg
        className={cn(
          "h-5 w-5",
          variant === "secondary" ? "text-muted-foreground" : "opacity-70"
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}
