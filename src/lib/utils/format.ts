import { formatDistanceToNow, format, parseISO } from "date-fns";

export function timeAgo(dateString: string): string {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
}

export function formatDate(dateString: string, fmt = "MMM d, yyyy"): string {
  return format(parseISO(dateString), fmt);
}

export function formatDateTime(dateString: string): string {
  return format(parseISO(dateString), "MMM d, yyyy HH:mm");
}

export function formatNumber(num: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatCurrency(amount: number, currency = "NGN"): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function getHealthColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

export function getHealthBg(score: number): string {
  if (score >= 80) return "bg-emerald-400";
  if (score >= 60) return "bg-yellow-400";
  if (score >= 40) return "bg-orange-400";
  return "bg-red-400";
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "emergency":
      return "text-red-400 bg-red-400/10 border-red-400/30";
    case "critical":
      return "text-orange-400 bg-orange-400/10 border-orange-400/30";
    case "warning":
      return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    default:
      return "text-blue-400 bg-blue-400/10 border-blue-400/30";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "operational":
    case "online":
    case "completed":
      return "text-emerald-400 bg-emerald-400/10";
    case "warning":
    case "in_progress":
      return "text-yellow-400 bg-yellow-400/10";
    case "critical":
    case "alert":
      return "text-orange-400 bg-orange-400/10";
    case "offline":
    case "failed":
      return "text-red-400 bg-red-400/10";
    case "maintenance":
    case "scheduled":
      return "text-blue-400 bg-blue-400/10";
    default:
      return "text-slate-400 bg-slate-400/10";
  }
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
