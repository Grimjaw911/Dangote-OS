"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: number;
  status?: "good" | "warning" | "critical" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  index?: number;
}

const statusConfig = {
  good: { border: "border-emerald-500/20", bg: "bg-emerald-500/5", glow: "hover:shadow-emerald-500/10" },
  warning: { border: "border-yellow-500/20", bg: "bg-yellow-500/5", glow: "hover:shadow-yellow-500/10" },
  critical: { border: "border-red-500/20", bg: "bg-red-500/5", glow: "hover:shadow-red-500/10" },
  neutral: { border: "border-border", bg: "", glow: "hover:shadow-primary/10" },
};

export function KPICard({
  title,
  value,
  unit,
  trend,
  trendValue,
  status = "neutral",
  icon: Icon,
  iconColor = "text-primary",
  description,
  index = 0,
}: KPICardProps) {
  const cfg = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "relative rounded-xl border p-4 bg-card metric-card",
        "hover:shadow-lg transition-all duration-200",
        cfg.border,
        cfg.bg,
        cfg.glow
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center bg-muted", iconColor)}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        {trend && trendValue !== undefined && (
          <div className={cn(
            "flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full",
            trend === "up" ? "text-emerald-400 bg-emerald-400/10" :
            trend === "down" ? "text-red-400 bg-red-400/10" :
            "text-muted-foreground bg-muted"
          )}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> :
             trend === "down" ? <TrendingDown className="w-3 h-3" /> :
             <Minus className="w-3 h-3" />}
            {trendValue}%
          </div>
        )}
      </div>

      <div className="space-y-0.5">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        {description && (
          <p className="text-[11px] text-muted-foreground/70 mt-1">{description}</p>
        )}
      </div>

      {/* Status indicator */}
      {status !== "neutral" && (
        <div className={cn(
          "absolute top-3 right-3 w-1.5 h-1.5 rounded-full",
          status === "good" ? "bg-emerald-400" :
          status === "warning" ? "bg-yellow-400 animate-pulse-dot" :
          "bg-red-400 animate-pulse-dot"
        )} />
      )}
    </motion.div>
  );
}
