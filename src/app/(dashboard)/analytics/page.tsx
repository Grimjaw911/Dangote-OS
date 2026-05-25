"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, TrendingDown, Activity, Zap,
  Shield, Wrench, AlertTriangle, Clock, ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiAreaChart, DonutChart, ProductionBarChart } from "@/components/charts/ProductionChart";
import { KPICard } from "@/components/dashboard/KPICard";
import { generateProductionMetrics, generateEnergyData, DEMO_EQUIPMENT } from "@/data/demo";
import { getHealthColor } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const PRODUCTION_30 = generateProductionMetrics(30);
const ENERGY_24 = generateEnergyData(24);

const WEEKLY_MAINTENANCE = [
  { name: "Mon", preventive: 3, corrective: 1, emergency: 0 },
  { name: "Tue", preventive: 2, corrective: 2, emergency: 1 },
  { name: "Wed", preventive: 4, corrective: 0, emergency: 0 },
  { name: "Thu", preventive: 1, corrective: 3, emergency: 1 },
  { name: "Fri", preventive: 3, corrective: 1, emergency: 0 },
  { name: "Sat", preventive: 2, corrective: 0, emergency: 0 },
  { name: "Sun", preventive: 1, corrective: 0, emergency: 0 },
];

const PPE_COMPLIANCE_WEEKLY = [
  { name: "Mon", compliance: 82 },
  { name: "Tue", compliance: 79 },
  { name: "Wed", compliance: 85 },
  { name: "Thu", compliance: 71 },
  { name: "Fri", compliance: 88 },
  { name: "Sat", compliance: 90 },
  { name: "Sun", compliance: 94 },
];

const DOWNTIME_DATA = [
  { name: "Kiln Motor", planned: 4, unplanned: 0 },
  { name: "Crusher C2", planned: 0, unplanned: 8 },
  { name: "Conveyor B3", planned: 2, unplanned: 0 },
  { name: "Power Turbine", planned: 12, unplanned: 4 },
  { name: "Hydraulic H2", planned: 6, unplanned: 1 },
  { name: "Cement Mill", planned: 3, unplanned: 0 },
];

const INCIDENT_TREND = [
  { name: "Jan", equipment: 4, safety: 3, security: 1 },
  { name: "Feb", equipment: 6, safety: 2, security: 2 },
  { name: "Mar", equipment: 3, safety: 5, security: 0 },
  { name: "Apr", equipment: 5, safety: 4, security: 1 },
  { name: "May", equipment: 8, safety: 5, security: 3 },
];

export default function AnalyticsPage() {
  const avgHealth = Math.round(DEMO_EQUIPMENT.reduce((a, e) => a + e.health_score, 0) / DEMO_EQUIPMENT.length);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics & Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive operational analytics and performance insights
          </p>
        </div>
        <Badge variant="secondary">Live Data</Badge>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard title="OEE" value="72.4" unit="%" icon={Activity} iconColor="text-blue-400" status="warning" trend="up" trendValue={4} index={0} />
        <KPICard title="MTBF" value="1,240" unit="hrs" icon={Clock} iconColor="text-emerald-400" status="good" trend="up" trendValue={8} index={1} />
        <KPICard title="Fleet Health" value={avgHealth} unit="%" icon={Wrench} iconColor="text-yellow-400" status="warning" trend="down" trendValue={3} index={2} />
        <KPICard title="PPE Avg." value="81" unit="%" icon={Shield} iconColor="text-purple-400" status="warning" trend="down" trendValue={2} index={3} />
      </div>

      <Tabs defaultValue="production">
        <TabsList>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        {/* Production Tab */}
        <TabsContent value="production" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Production Efficiency (30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <MultiAreaChart
                  data={PRODUCTION_30}
                  xKey="date"
                  areas={[
                    { dataKey: "efficiency", color: "#10b981", name: "Efficiency %" },
                  ]}
                  height={200}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Daily Output (tons)</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductionBarChart
                  data={PRODUCTION_30.slice(-14)}
                  bars={[{ dataKey: "output", color: "#0ea5e9", name: "Output (T)" }]}
                  xKey="date"
                  height={200}
                />
              </CardContent>
            </Card>
          </div>

          {/* Production stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Avg Daily Output", value: "9,250 T", change: "+5.2%", good: true },
              { label: "Total Monthly", value: "277,500 T", change: "+3.8%", good: true },
              { label: "Avg Efficiency", value: "84.7%", change: "-1.2%", good: false },
              { label: "Peak Output", value: "11,840 T", change: "Apr 18", good: true },
            ].map((stat) => (
              <div key={stat.label} className="p-3 rounded-xl border border-border bg-card">
                <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-bold mt-1">{stat.value}</p>
                <p className={cn("text-xs mt-0.5", stat.good ? "text-emerald-400" : "text-red-400")}>
                  {stat.change}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Weekly Maintenance Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductionBarChart
                  data={WEEKLY_MAINTENANCE}
                  bars={[
                    { dataKey: "preventive", color: "#0ea5e9", name: "Preventive" },
                    { dataKey: "corrective", color: "#f59e0b", name: "Corrective" },
                    { dataKey: "emergency", color: "#ef4444", name: "Emergency" },
                  ]}
                  height={200}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Downtime by Equipment (Hours)</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductionBarChart
                  data={DOWNTIME_DATA}
                  bars={[
                    { dataKey: "planned", color: "#0ea5e9", name: "Planned" },
                    { dataKey: "unplanned", color: "#ef4444", name: "Unplanned" },
                  ]}
                  height={200}
                />
              </CardContent>
            </Card>
          </div>

          {/* Equipment health table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Fleet Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {DEMO_EQUIPMENT.map((equip) => (
                  <div key={equip.id} className="flex items-center gap-4">
                    <div className="w-40 text-xs font-medium truncate">{equip.name}</div>
                    <div className="flex-1">
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all")}
                          style={{
                            width: `${equip.health_score}%`,
                            background:
                              equip.health_score >= 80 ? "#10b981" :
                              equip.health_score >= 60 ? "#f59e0b" :
                              equip.health_score >= 40 ? "#f97316" :
                              "#ef4444"
                          }}
                        />
                      </div>
                    </div>
                    <span className={cn("text-xs font-bold w-10 text-right", getHealthColor(equip.health_score))}>
                      {equip.health_score}%
                    </span>
                    <span className="text-[10px] text-muted-foreground w-20 text-right">
                      {equip.rul_hours.toLocaleString()}h RUL
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">PPE Compliance (This Week)</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductionBarChart
                  data={PPE_COMPLIANCE_WEEKLY}
                  bars={[{ dataKey: "compliance", color: "#10b981", name: "Compliance %" }]}
                  height={200}
                />
                <div className="mt-3 p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs">
                  <p className="text-yellow-400 font-medium">⚠ Below target on Thursday (71%)</p>
                  <p className="text-muted-foreground mt-0.5">Night shift Kiln Bay 1 had highest violation rate</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Safety KPIs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Days Without Incident", value: "14", good: true, desc: "Since last LTI" },
                    { label: "PPE Compliance Rate", value: "81%", good: false, desc: "Target: 85%" },
                    { label: "Near-Miss Reports", value: "7", good: true, desc: "This month" },
                    { label: "Safety Audits Completed", value: "4/5", good: true, desc: "This month" },
                    { label: "First Aid Cases", value: "2", good: true, desc: "This month" },
                    { label: "Corrective Actions Open", value: "3", good: false, desc: "Overdue: 1" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-medium">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                      </div>
                      <div className={cn(
                        "text-sm font-bold px-2 py-0.5 rounded",
                        item.good ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
                      )}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Energy Tab */}
        <TabsContent value="energy" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Energy Consumption (24 Hours)</CardTitle>
              </CardHeader>
              <CardContent>
                <MultiAreaChart
                  data={ENERGY_24}
                  xKey="time"
                  areas={[
                    { dataKey: "consumption", color: "#22d3ee", name: "Actual (kWh)" },
                    { dataKey: "target", color: "#6b7280", name: "Target (kWh)" },
                  ]}
                  height={220}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Energy by Asset</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={[
                    { name: "Cement Mill", value: 35, color: "#0ea5e9" },
                    { name: "Kilns", value: 28, color: "#10b981" },
                    { name: "Crushers", value: 15, color: "#f59e0b" },
                    { name: "Conveyors", value: 12, color: "#8b5cf6" },
                    { name: "Utilities", value: 10, color: "#6b7280" },
                  ]}
                  height={180}
                  label="kWh"
                  labelValue="1,240"
                />
                <div className="space-y-1.5 mt-2">
                  {[
                    { name: "Cement Mill", pct: 35, color: "#0ea5e9" },
                    { name: "Kilns", pct: 28, color: "#10b981" },
                    { name: "Crushers", pct: 15, color: "#f59e0b" },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span className="text-muted-foreground flex-1">{item.name}</span>
                      <span className="font-medium">{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Incidents Tab */}
        <TabsContent value="incidents" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Incident Trend (5 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <MultiAreaChart
                data={INCIDENT_TREND}
                xKey="name"
                areas={[
                  { dataKey: "equipment", color: "#ef4444", name: "Equipment" },
                  { dataKey: "safety", color: "#f59e0b", name: "Safety" },
                  { dataKey: "security", color: "#8b5cf6", name: "Security" },
                ]}
                height={250}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
