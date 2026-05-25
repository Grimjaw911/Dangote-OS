"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store";
import { Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIChatPanel } from "@/components/ai/AIChatPanel";

export default function AIPage() {
  const { setAiChatOpen } = useUIStore();

  useEffect(() => {
    setAiChatOpen(true);
  }, [setAiChatOpen]);

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold">DangoteAI Assistant</h1>
      <p className="text-muted-foreground mt-2 max-w-md">
        Your industrial intelligence assistant. Ask about equipment health, predict failures,
        analyze incidents, and get operational recommendations — all powered by local AI.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 max-w-2xl w-full">
        {[
          { title: "Equipment Intelligence", desc: "Health scores, failure predictions, RUL estimates" },
          { title: "Safety Analysis", desc: "PPE compliance trends, incident patterns, risk assessment" },
          { title: "Operational Insights", desc: "Energy optimization, production efficiency, scheduling" },
        ].map((feature) => (
          <div key={feature.title} className="p-4 rounded-xl border border-border bg-card text-left">
            <p className="text-sm font-semibold">{feature.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
          </div>
        ))}
      </div>
      <Button className="mt-6 gap-2" onClick={() => setAiChatOpen(true)}>
        <Bot className="w-4 h-4" />
        Open AI Chat
      </Button>
      <p className="text-xs text-muted-foreground mt-3">
        Powered by local Ollama • No data leaves your network
      </p>
    </div>
  );
}
