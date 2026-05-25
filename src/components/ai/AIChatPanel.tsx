"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore, useAIChatStore } from "@/store";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils/format";
import type { ChatMessage } from "@/types";

const QUICK_PROMPTS = [
  "What's the health status of all equipment?",
  "Show me critical alerts",
  "Any predicted failures in 48 hours?",
  "PPE compliance summary",
  "Top 3 maintenance priorities",
];

const AI_RESPONSES: Record<string, string> = {
  default: `I'm analyzing the current operational data...

Based on my analysis:
- **3 equipment units** require attention (Crusher C2, Turbine T1, Hydraulic H2)
- **PPE compliance** is at 76% — below the 85% target
- **Predicted failure risk**: Crusher C2 bearing within 48 hours (89% probability)
- **Energy optimization** opportunity identified — potential ₦2.4M monthly savings

Recommendation: Prioritize emergency maintenance on Crusher C2 and schedule turbine inspection before next shift.`,

  health: `**Equipment Health Summary** (as of now):

| Equipment | Health | Status |
|-----------|--------|--------|
| Kiln Motor A1 | 87% | ✅ Operational |
| Crusher C2 | 62% | ⚠️ Warning |
| Conveyor B3 | 94% | ✅ Operational |
| Power Turbine T1 | 38% | 🔴 Critical |
| Hydraulic H2 | 55% | ⚠️ Warning |
| Cooling Fan F4 | 91% | ✅ Operational |
| Cement Mill M1 | 78% | ✅ Operational |

**Average fleet health: 72%** — Below recommended 80% threshold.

Immediate action needed on Power Turbine T1 and Crusher C2.`,

  alerts: `**Active Critical Alerts** (4 unacknowledged):

🔴 **EMERGENCY** — Smoke Detected, Kiln Area (3 min ago)
🔴 **CRITICAL** — Vibration Anomaly, Crusher C2 (15 min ago)
🔴 **CRITICAL** — Unauthorized Access, Server Room (20 min ago)
⚠️ **WARNING** — PPE Violation, Kiln Bay 1 (5 min ago)

I recommend:
1. Dispatch safety team to Kiln Area immediately
2. Acknowledge and investigate Crusher vibration
3. Review server room access logs
4. Brief shift supervisor on PPE violations`,

  failures: `**Failure Predictions (Next 48 Hours):**

🔴 **Crusher C2** — Bearing failure probability: **89%**
- Remaining useful life: ~18 hours
- Action: Emergency bearing replacement (WO-2025-0142 in progress)

🟠 **Power Turbine T1** — Multi-component failure: **74%**
- Critical: blade stress + bearing wear
- Action: Controlled shutdown + full inspection

🟡 **Kiln Motor A1** — Thermal overrun risk: **34%**
- Temperature trending +3°C/week
- Action: Monitor closely, schedule cooling inspection

Total estimated downtime if unaddressed: **72-96 hours**`,

  ppe: `**PPE Compliance Report** (Today):

Overall compliance: **76%** ⚠️ (Target: 85%)

By zone:
- Main Gate: 94% ✅
- Kiln Bay 1: 61% 🔴 (highest violations)
- Cement Mill: 79% ⚠️
- Control Room: 100% ✅
- Storage Yard: 82% ⚠️

**Violations detected today:** 14
- No helmet: 8 cases
- No safety vest: 4 cases
- No gloves: 2 cases

**Recommendation:** Deploy supervisor to Kiln Bay 1. Consider PPE reminder announcement.`,
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("health") || lower.includes("status")) return AI_RESPONSES.health;
  if (lower.includes("alert") || lower.includes("critical")) return AI_RESPONSES.alerts;
  if (lower.includes("failure") || lower.includes("predict") || lower.includes("48")) return AI_RESPONSES.failures;
  if (lower.includes("ppe") || lower.includes("compliance") || lower.includes("safety")) return AI_RESPONSES.ppe;
  if (lower.includes("priority") || lower.includes("maintenance")) return AI_RESPONSES.failures;
  return AI_RESPONSES.default;
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-2.5", isAssistant ? "flex-row" : "flex-row-reverse")}
    >
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1",
          isAssistant ? "bg-primary/20 border border-primary/30" : "bg-muted border border-border"
        )}
      >
        {isAssistant ? (
          <Bot className="w-3.5 h-3.5 text-primary" />
        ) : (
          <User className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </div>
      <div className={cn("max-w-[85%] flex flex-col gap-1", isAssistant ? "items-start" : "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed",
            isAssistant
              ? "bg-muted text-foreground rounded-tl-sm"
              : "bg-primary text-primary-foreground rounded-tr-sm"
          )}
        >
          {message.isTyping ? (
            <div className="flex gap-1 items-center h-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-current"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">{timeAgo(message.timestamp)}</span>
      </div>
    </motion.div>
  );
}

export function AIChatPanel() {
  const { aiChatOpen, setAiChatOpen } = useUIStore();
  const { messages, isLoading, addMessage, setLoading, clearMessages } = useAIChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isLoading) return;

    setInput("");

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);

    const typingMsg: ChatMessage = {
      id: `typing-${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      isTyping: true,
    };
    addMessage(typingMsg);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const responseMsg: ChatMessage = {
      id: `resp-${Date.now()}`,
      role: "assistant",
      content: getAIResponse(content),
      timestamp: new Date().toISOString(),
    };

    // Remove typing indicator and add real response
    useAIChatStore.setState((s) => ({
      messages: [...s.messages.filter((m) => !m.isTyping), responseMsg],
      isLoading: false,
    }));
  };

  return (
    <AnimatePresence>
      {aiChatOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setAiChatOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col bg-background border-l border-border shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold">DangoteAI Assistant</h2>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse-dot" />
                  Industrial Intelligence Active
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-muted-foreground"
                onClick={clearMessages}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-muted-foreground"
                onClick={() => setAiChatOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages — only this section scrolls */}
            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}
              </div>
            </div>

            {/* Quick prompts — fixed, no scroll */}
            <div className="shrink-0 px-4 pb-2">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="shrink-0 text-[10px] px-2.5 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors border border-border"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input — fixed, no scroll */}
            <div className="shrink-0 p-4 border-t border-border">
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask about equipment, alerts, predictions..."
                    className="w-full resize-none rounded-xl border border-border bg-muted px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px] max-h-24"
                    rows={1}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="w-10 h-10 rounded-xl shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                AI-powered by local models • No data leaves your plant
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
