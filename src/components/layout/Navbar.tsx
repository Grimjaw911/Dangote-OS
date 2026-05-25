"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Search, Sun, Moon, Monitor, ChevronDown,
  LogOut, User, Settings, Shield, X, Check, MessageSquareText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore, useAuthStore, useNotificationsStore } from "@/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { timeAgo, getSeverityColor, getInitials } from "@/lib/utils/format";
import { DEMO_PLANTS } from "@/data/demo";
import type { Notification } from "@/types";

function NotificationItem({
  notification, onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
}) {
  const dotColor: Record<string, string> = {
    emergency: "bg-red-500", critical: "bg-orange-500",
    warning: "bg-yellow-500", info: "bg-blue-500",
  };
  return (
    <div
      className={cn("flex gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-muted/50",
        !notification.is_read && "bg-muted/30")}
      onClick={() => onMarkRead(notification.id)}
    >
      <div className={cn("w-2 h-2 rounded-full mt-1 flex-shrink-0", dotColor[notification.severity] || "bg-blue-500")} />
      <div className="flex-1 min-w-0">
        <p className={cn("text-xs font-medium truncate", notification.is_read ? "text-muted-foreground" : "text-foreground")}>
          {notification.title}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(notification.created_at)}</p>
      </div>
      {!notification.is_read && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 flex-shrink-0" />}
    </div>
  );
}

type Theme = "dark" | "light" | "system";

function applyTheme(t: Theme) {
  const isDark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem("theme", t);
}

export function Navbar() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme | null) ?? "dark";
    setThemeState(saved);
    applyTheme(saved);
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    applyTheme(t);
  }

  const { setCommandPaletteOpen, setAiChatOpen, selectedPlant, setSelectedPlant } = useUIStore();
  const { user } = useAuthStore();
  const { notifications, unreadCount, markRead, markAllRead } = useNotificationsStore();
  const [notifOpen, setNotifOpen] = useState(false);

  const currentPlant = DEMO_PLANTS.find((p) => p.id === selectedPlant);

  return (
    <header className="h-16 border-b border-border flex items-center gap-4 px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      {/* Plant selector */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm cursor-default outline-none">
          <div className={cn("w-2 h-2 rounded-full",
            currentPlant?.status === "operational" ? "bg-emerald-400" :
            currentPlant?.status === "maintenance" ? "bg-yellow-400" : "bg-red-400"
          )} />
          <span className="font-medium text-foreground hidden sm:block max-w-[160px] truncate">
            {currentPlant?.name || "Select Plant"}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Switch Plant</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {DEMO_PLANTS.map((plant) => (
            <DropdownMenuItem key={plant.id} onClick={() => setSelectedPlant(plant.id)} className="flex items-center gap-3">
              <div className={cn("w-2 h-2 rounded-full flex-shrink-0",
                plant.status === "operational" ? "bg-emerald-400" :
                plant.status === "maintenance" ? "bg-yellow-400" : "bg-red-400"
              )} />
              <div className="flex-1">
                <p className="text-sm font-medium">{plant.name}</p>
                <p className="text-xs text-muted-foreground">{plant.location}</p>
              </div>
              {selectedPlant === plant.id && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm text-muted-foreground flex-1 max-w-sm"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:block">Search anything...</span>
        <span className="hidden sm:block ml-auto text-xs bg-background border border-border rounded px-1.5 py-0.5">⌘K</span>
      </button>

      <div className="flex items-center gap-1 ml-auto">
        {/* AI Chat */}
        <Button variant="ghost" size="icon" className="w-9 h-9 text-muted-foreground hover:text-primary" onClick={() => setAiChatOpen(true)}>
          <MessageSquareText className="w-4 h-4" />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-muted-foreground hover:text-foreground relative"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 w-80 z-50 flex flex-col rounded-xl border border-border bg-card shadow-xl shadow-black/20 overflow-hidden max-h-[min(480px,80vh)]"
                >
                  {/* Fixed header */}
                  <div className="shrink-0 flex items-center justify-between p-3 border-b border-border">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-[11px] text-primary hover:underline">
                          Mark all read
                        </button>
                      )}
                      <button onClick={() => setNotifOpen(false)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {/* Scrollable list */}
                  <div className="overflow-y-auto min-h-0">
                    <div className="p-2 space-y-1">
                      {notifications.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-6">No notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <NotificationItem key={n.id} notification={n} onMarkRead={markRead} />
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none">
            {theme === "light" ? <Sun className="w-4 h-4" /> : theme === "system" ? <Monitor className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}><Sun className="w-4 h-4 mr-2" /> Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}><Moon className="w-4 h-4 mr-2" /> Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}><Monitor className="w-4 h-4 mr-2" /> System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-muted transition-colors outline-none">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
              {user ? getInitials(user.full_name) : "AD"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium leading-none">{user?.full_name || "Admin"}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">
                {user?.role?.replace(/_/g, " ") || "Administrator"}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">{user?.email || "admin@dangote.com"}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="w-3.5 h-3.5 mr-2" /> Profile</DropdownMenuItem>
            <DropdownMenuItem><Shield className="w-3.5 h-3.5 mr-2" /> Security</DropdownMenuItem>
            <DropdownMenuItem><Settings className="w-3.5 h-3.5 mr-2" /> Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-400 focus:text-red-400"><LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
