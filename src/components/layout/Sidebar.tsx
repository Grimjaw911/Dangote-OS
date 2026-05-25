"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Camera,
  Wrench,
  AlertTriangle,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Zap,
  Shield,
  FileText,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store";
import { Badge } from "@/components/ui/badge";
import { useAlertsStore } from "@/store";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const NAV_ITEMS = [
  {
    label: "Command Center",
    href: "/",
    icon: LayoutDashboard,
    description: "Global operations overview",
  },
  {
    label: "Surveillance",
    href: "/surveillance",
    icon: Camera,
    description: "AI camera & detection",
    badge: "LIVE",
    badgeColor: "bg-emerald-500",
  },
  {
    label: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
    description: "Equipment & predictive AI",
  },
  {
    label: "Incidents",
    href: "/incidents",
    icon: AlertTriangle,
    description: "Incident management",
    alertBadge: true,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Reports & analytics",
  },
  {
    label: "AI Assistant",
    href: "/ai",
    icon: Bot,
    description: "Industrial AI chatbot",
    badge: "AI",
    badgeColor: "bg-purple-500",
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileText,
    description: "Generate & export reports",
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
    description: "User & access management",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "System configuration",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const { unreadCount } = useAlertsStore();

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border",
        "sidebar-transition overflow-hidden",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border flex-shrink-0">
        <AnimatePresence mode="wait">
          {!sidebarCollapsed ? (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2.5 min-w-0"
            >
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-sidebar animate-pulse-dot" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-sidebar-foreground leading-none truncate">DANGOTE OS</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">Industrial Platform v2.5</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="logo-mini"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto"
            >
              <Zap className="w-4 h-4 text-primary-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status bar */}
      {!sidebarCollapsed && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-sidebar-accent border border-sidebar-border flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground">System Status</p>
            <p className="text-xs font-medium text-emerald-400 truncate">All Systems Operational</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {!sidebarCollapsed && (
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Modules
          </p>
        )}
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          const navItem = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "flex-shrink-0 transition-colors",
                  sidebarCollapsed ? "w-5 h-5 mx-auto" : "w-4 h-4",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
                )}
              />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded text-white", item.badgeColor)}>
                      {item.badge}
                    </span>
                  )}
                  {item.alertBadge && unreadCount > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white bg-red-500 animate-alert-flash">
                      {unreadCount}
                    </span>
                  )}
                </>
              )}
            </Link>
          );

          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger>{navItem}</TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-muted-foreground">{item.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return navItem;
        })}
      </nav>

      {/* Security score */}
      {!sidebarCollapsed && (
        <div className="mx-3 mb-3 px-3 py-2.5 rounded-lg bg-sidebar-accent border border-sidebar-border">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-yellow-400" />
              <span className="text-[10px] text-muted-foreground">Security Risk</span>
            </div>
            <span className="text-xs font-bold text-yellow-400">68/100</span>
          </div>
          <div className="w-full h-1 rounded-full bg-sidebar-border overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
              style={{ width: "68%" }}
            />
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={cn(
          "absolute -right-3 top-20 z-10 w-6 h-6 rounded-full",
          "bg-sidebar border border-sidebar-border flex items-center justify-center",
          "text-muted-foreground hover:text-primary transition-colors shadow-md"
        )}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}
