"use client";

import { useState, useEffect } from "react";
import {
  Settings, Bell, Shield, Database, Cpu, Globe,
  Moon, Sun, Monitor, Save, RefreshCw, Zap, Mail,
  MessageSquare, Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useUIStore } from "@/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light" | "system";

export default function SettingsPage() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme | null) ?? "dark";
    setThemeState(saved);
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("theme", t);
    const isDark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  }
  const [notifications, setNotifications] = useState({
    email: true, push: true, whatsapp: false, criticalOnly: false,
  });
  const [ai, setAI] = useState({
    localModel: true, ollamaUrl: "http://localhost:11434", model: "llama3.2",
    autoInsights: true, anomalyDetection: true,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your Dangote OS platform preferences
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ai">AI & Models</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs mb-3 block">Theme</Label>
                <div className="flex gap-2">
                  {[
                    { value: "dark", label: "Dark", icon: Moon },
                    { value: "light", label: "Light", icon: Sun },
                    { value: "system", label: "System", icon: Monitor },
                  ].map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value as Theme)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all",
                          theme === t.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {t.label}
                        {theme === t.value && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-1.5 block">Platform Name</Label>
                  <Input defaultValue="Dangote OS" className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">App URL</Label>
                  <Input defaultValue="http://localhost:3000" className="h-9 text-sm" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Plant Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-1.5 block">Default Plant</Label>
                  <Input defaultValue="Dangote Cement - Obajana" className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Time Zone</Label>
                  <Input defaultValue="Africa/Lagos (WAT)" className="h-9 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-1.5 block">Currency</Label>
                  <Input defaultValue="NGN (₦)" className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Language</Label>
                  <Input defaultValue="English (en-NG)" className="h-9 text-sm" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Alert Channels</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "email", label: "Email Alerts", desc: "Send critical alerts to registered email", icon: Mail },
                { key: "push", label: "Push Notifications", desc: "Browser & mobile push notifications", icon: Bell },
                { key: "whatsapp", label: "WhatsApp Integration", desc: "WhatsApp Business API alerts (requires setup)", icon: MessageSquare },
                { key: "criticalOnly", label: "Critical Alerts Only", desc: "Only receive emergency & critical severity alerts", icon: Shield },
              ].map(({ key, label, desc, icon: Icon }) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={notifications[key as keyof typeof notifications]}
                    onCheckedChange={(v) => setNotifications((n) => ({ ...n, [key]: v }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Alert Thresholds</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Equipment Health Warning", value: "60", unit: "%" },
                { label: "Equipment Health Critical", value: "40", unit: "%" },
                { label: "Anomaly Score Alert", value: "70", unit: "%" },
                { label: "PPE Compliance Warning", value: "80", unit: "%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <Label className="text-xs flex-1">{item.label}</Label>
                  <div className="flex items-center gap-1">
                    <Input defaultValue={item.value} className="h-8 w-16 text-sm text-center" />
                    <span className="text-xs text-muted-foreground">{item.unit}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI */}
        <TabsContent value="ai" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              AI Engine Configuration
            </CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">Local AI Mode</p>
                  <p className="text-xs text-muted-foreground">Use local Ollama models — no data leaves your network</p>
                </div>
                <Switch
                  checked={ai.localModel}
                  onCheckedChange={(v) => setAI((a) => ({ ...a, localModel: v }))}
                />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-1.5 block">Ollama API URL</Label>
                  <Input value={ai.ollamaUrl} onChange={(e) => setAI((a) => ({ ...a, ollamaUrl: e.target.value }))} className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">AI Model</Label>
                  <Input value={ai.model} onChange={(e) => setAI((a) => ({ ...a, model: e.target.value }))} className="h-9 text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">Auto AI Insights</p>
                  <p className="text-xs text-muted-foreground">Automatically generate AI recommendations every hour</p>
                </div>
                <Switch checked={ai.autoInsights} onCheckedChange={(v) => setAI((a) => ({ ...a, autoInsights: v }))} />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">Anomaly Detection</p>
                  <p className="text-xs text-muted-foreground">Real-time sensor anomaly detection via TensorFlow.js</p>
                </div>
                <Switch checked={ai.anomalyDetection} onCheckedChange={(v) => setAI((a) => ({ ...a, anomalyDetection: v }))} />
              </div>
              <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
                <p className="text-xs">AI engine is running. Processing sensor data in real-time.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Supabase", status: "connected", desc: "Database & real-time subscriptions", icon: Database, color: "text-emerald-400" },
              { name: "Ollama AI", status: "ready", desc: "Local LLM server for AI assistant", icon: Cpu, color: "text-blue-400" },
              { name: "TensorFlow.js", status: "active", desc: "Browser-based anomaly detection ML", icon: Zap, color: "text-yellow-400" },
              { name: "WhatsApp API", status: "not configured", desc: "WhatsApp Business alert integration", icon: MessageSquare, color: "text-muted-foreground" },
              { name: "Email SMTP", status: "connected", desc: "Alert & report delivery", icon: Mail, color: "text-emerald-400" },
              { name: "RTSP Streams", status: "simulated", desc: "Camera stream integration", icon: Globe, color: "text-purple-400" },
            ].map((integration) => {
              const Icon = integration.icon;
              const statusColor = integration.status === "connected" || integration.status === "active" ? "text-emerald-400 bg-emerald-500/10"
                : integration.status === "ready" || integration.status === "simulated" ? "text-blue-400 bg-blue-500/10"
                : "text-muted-foreground bg-muted";
              return (
                <Card key={integration.name} className="card-hover">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <Icon className={cn("w-5 h-5", integration.color)} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">{integration.desc}</p>
                      </div>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded capitalize font-medium", statusColor)}>
                        {integration.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Database */}
        <TabsContent value="database" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Supabase Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs mb-1.5 block">Project URL</Label>
                <Input defaultValue="https://tzbvtwdfrsodcrcgeuvp.supabase.co" className="h-9 text-sm font-mono" readOnly />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Project ID</Label>
                <Input defaultValue="tzbvtwdfrsodcrcgeuvp" className="h-9 text-sm font-mono" readOnly />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="gap-2 text-xs">
                  <RefreshCw className="w-3.5 h-3.5" /> Test Connection
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-xs">
                  <Database className="w-3.5 h-3.5" /> View Schema
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
