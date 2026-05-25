"use client";

import { useState } from "react";
import {
  FileText, Download, Plus, Calendar, BarChart3,
  Shield, Wrench, AlertTriangle, CheckCircle2, Loader2,
  Eye, TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KPICard } from "@/components/dashboard/KPICard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const REPORT_TYPES = [
  { id: "daily_ops", label: "Daily Operations Summary", icon: BarChart3, color: "text-blue-400", desc: "24-hour operational overview with KPIs", time: "~30 sec" },
  { id: "maintenance_weekly", label: "Weekly Maintenance Report", icon: Wrench, color: "text-orange-400", desc: "Equipment health, work orders, downtime analysis", time: "~45 sec" },
  { id: "safety_compliance", label: "Safety & Compliance Report", icon: Shield, color: "text-purple-400", desc: "PPE compliance, incidents, safety KPIs", time: "~30 sec" },
  { id: "incident_summary", label: "Incident Summary", icon: AlertTriangle, color: "text-red-400", desc: "All incidents with AI analysis", time: "~20 sec" },
  { id: "equipment_health", label: "Equipment Health Report", icon: TrendingUp, color: "text-emerald-400", desc: "Full fleet health assessment with predictions", time: "~60 sec" },
  { id: "energy_usage", label: "Energy Consumption Report", icon: BarChart3, color: "text-cyan-400", desc: "Energy analysis and optimization recommendations", time: "~30 sec" },
];

const RECENT_REPORTS = [
  { id: "r1", name: "Daily Operations Summary", type: "daily", status: "ready", date: "Today, 06:00", size: "2.4 MB" },
  { id: "r2", name: "Weekly Maintenance Report W20", type: "maintenance", status: "ready", date: "May 19, 2025", size: "4.1 MB" },
  { id: "r3", name: "Safety Compliance - April", type: "safety", status: "ready", date: "May 1, 2025", size: "1.8 MB" },
  { id: "r4", name: "Incident Report INC-2025-001", type: "incident", status: "ready", date: "May 24, 2025", size: "980 KB" },
  { id: "r5", name: "Monthly Executive Summary", type: "monthly", status: "generating", date: "May 24, 2025", size: "-" },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = async (reportId: string, reportName: string) => {
    setGenerating(reportId);
    toast.info(`Generating ${reportName}...`);
    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 2000));
    setGenerating(null);
    toast.success(`${reportName} is ready for download!`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Export</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate, schedule, and export operational reports
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard title="Reports Generated" value={47} icon={FileText} iconColor="text-blue-400" status="neutral" index={0} />
        <KPICard title="This Month" value={12} icon={Calendar} iconColor="text-emerald-400" status="neutral" index={1} />
        <KPICard title="Scheduled" value={5} icon={BarChart3} iconColor="text-purple-400" status="neutral" index={2} />
        <KPICard title="Auto Reports" value={3} icon={CheckCircle2} iconColor="text-cyan-400" status="good" index={3} />
      </div>

      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REPORT_TYPES.map((type) => {
              const Icon = type.icon;
              const isGenerating = generating === type.id;
              return (
                <Card key={type.id} className="card-hover">
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className={cn("w-5 h-5", type.color)} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{type.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{type.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">Est. {type.time}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1.5"
                          onClick={() => handleGenerate(type.id, type.label)}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                          ) : (
                            <><FileText className="w-3.5 h-3.5" /> Generate PDF</>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs gap-1.5"
                          onClick={() => toast.info("Excel export started")}
                        >
                          <Download className="w-3.5 h-3.5" /> XLSX
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-4">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {RECENT_REPORTS.map((report) => (
                  <div key={report.id} className="flex items-center gap-4 p-3.5 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.date} • {report.size}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {report.status === "generating" ? (
                        <Badge variant="secondary" className="text-xs gap-1.5">
                          <Loader2 className="w-3 h-3 animate-spin" /> Generating
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          Ready
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-4">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {[
                  { name: "Daily Operations Summary", freq: "Daily at 06:00", recipients: "plant@dangote.com", active: true },
                  { name: "Weekly Maintenance Report", freq: "Every Monday at 08:00", recipients: "maintenance@dangote.com", active: true },
                  { name: "Monthly Safety Report", freq: "1st of each month", recipients: "safety@dangote.com", active: true },
                  { name: "Weekly Energy Report", freq: "Every Friday at 17:00", recipients: "engineering@dangote.com", active: false },
                  { name: "Incident Summary", freq: "Triggered on severity ≥ critical", recipients: "management@dangote.com", active: true },
                ].map((schedule) => (
                  <div key={schedule.name} className="flex items-center gap-4 p-3.5 rounded-xl border border-border">
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", schedule.active ? "bg-emerald-400" : "bg-muted-foreground")} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{schedule.name}</p>
                      <p className="text-xs text-muted-foreground">{schedule.freq} → {schedule.recipients}</p>
                    </div>
                    <Badge variant={schedule.active ? "default" : "secondary"} className="text-xs">
                      {schedule.active ? "Active" : "Paused"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
