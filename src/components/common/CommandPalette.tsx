"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search, LayoutDashboard, Camera, Wrench, AlertTriangle,
  BarChart3, Users, Settings, FileText, Bot, Zap, X,
} from "lucide-react";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";

const COMMANDS = [
  { id: "home", label: "Command Center", href: "/", icon: LayoutDashboard, category: "Navigation" },
  { id: "surveillance", label: "Surveillance Center", href: "/surveillance", icon: Camera, category: "Navigation" },
  { id: "maintenance", label: "Predictive Maintenance", href: "/maintenance", icon: Wrench, category: "Navigation" },
  { id: "incidents", label: "Incident Management", href: "/incidents", icon: AlertTriangle, category: "Navigation" },
  { id: "analytics", label: "Analytics & Reports", href: "/analytics", icon: BarChart3, category: "Navigation" },
  { id: "ai", label: "AI Assistant", href: "/ai", icon: Bot, category: "Navigation" },
  { id: "reports", label: "Reports", href: "/reports", icon: FileText, category: "Navigation" },
  { id: "users", label: "User Management", href: "/users", icon: Users, category: "Navigation" },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings, category: "Navigation" },
  { id: "ai-chat", label: "Open AI Chat", icon: Zap, category: "Actions", action: "ai_chat" },
  { id: "dark", label: "Toggle Dark Mode", icon: Zap, category: "Actions", action: "theme" },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setAiChatOpen } = useUIStore();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  const filtered = COMMANDS.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const execute = useCallback(
    (cmd: (typeof COMMANDS)[0]) => {
      setCommandPaletteOpen(false);
      setQuery("");
      if (cmd.href) {
        router.push(cmd.href);
      } else if (cmd.action === "ai_chat") {
        setAiChatOpen(true);
      }
    },
    [router, setCommandPaletteOpen, setAiChatOpen]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === "Escape") setCommandPaletteOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setCommandPaletteOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!commandPaletteOpen) return;
      if (e.key === "ArrowDown") setSelected((s) => Math.min(s + 1, filtered.length - 1));
      if (e.key === "ArrowUp") setSelected((s) => Math.max(s - 1, 0));
      if (e.key === "Enter" && filtered[selected]) execute(filtered[selected]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [commandPaletteOpen, filtered, selected, execute]);

  useEffect(() => setSelected(0), [query]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-24 z-50 -translate-x-1/2 w-full max-w-lg"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search modules, commands, equipment..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => setCommandPaletteOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-6">No results found</p>
                ) : (
                  Object.entries(
                    filtered.reduce(
                      (acc, cmd) => ({
                        ...acc,
                        [cmd.category]: [...(acc[cmd.category] || []), cmd],
                      }),
                      {} as Record<string, typeof COMMANDS>
                    )
                  ).map(([category, items]) => (
                    <div key={category}>
                      <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {category}
                      </p>
                      {items.map((cmd, i) => {
                        const globalIdx = filtered.indexOf(cmd);
                        const Icon = cmd.icon;
                        return (
                          <button
                            key={cmd.id}
                            onClick={() => execute(cmd)}
                            onMouseEnter={() => setSelected(globalIdx)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                              globalIdx === selected
                                ? "bg-primary/10 text-primary"
                                : "text-foreground hover:bg-muted"
                            )}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span>{cmd.label}</span>
                            {cmd.href && (
                              <span className="ml-auto text-xs text-muted-foreground">↵</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[10px] text-muted-foreground">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
