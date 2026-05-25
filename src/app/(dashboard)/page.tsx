"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera, Wrench, AlertTriangle, Activity, Zap,
  Shield, TrendingUp, Clock, Users, ThermometerSun,
  CheckCircle2, XCircle, AlertCircle, BarChart3, RefreshCw,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { MultiAreaChart, DonutChart, ProductionBarChart } from "@/components/charts/ProductionChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboardStore, useAlertsStore, useAIInsightsStore } from "@/store";
import { DEMO_EQUIPMENT, DEMO_INCIDENTS, generateProductionMetrics, generateEnergyData } from "@/data/demo";
import { getHealthColor, getSeverityColor, timeAgo, getStatusColor } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const PRODUCTION_DATA = generateProductionMetrics(14);
const ENERGY_DATA = generateEnergyData(24);

const EQUIPMENT_STATUS_DATA = [
  { name: "Operational", value: 5, color: "#10b981" },
  { name: "Warning", value: 2, color: "#f59e0b" },
  { name: "Critical", value: 1, color: "#ef4444" },
  { name: "Maintenance", value: 1, color: "#3b82f6" },
];

const INCIDENT_TYPE_DATA = [
  { name: "Equipment", value: 8, color: "#ef4444" },
  { name: "Safety", value: 5, color: "#f59e0b" },
  { name: "Security", value: 3, color: "#8b5cf6" },
  { name: "Process", value: 2, color: "#0ea5e9" },
];

export default function CommandCenterPage() {
  const { stats, updateStats } = useDashboardStore();
  const { alerts } = useAlertsStore();
  const { insights } = useAIInsightsStore();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      updateStats({
        workers_detected: Math.floor(20 + Math.random() * 10),
        energy_consumption: Math.floor(1100 + Math.random() * 300),
        ppe_compliance: Math.floor(70 + Math.random() * 15),
      });
      setLastUpdate(new Date());
    }, 15000);
    return () => clearInterval(interval);
  }, [updateStats]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    updateStats({
      workers_detected: Math.floor(20 + Math.random() * 10),
      production_efficiency: Math.floor(80 + Math.random() * 15),
    });
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  const criticalEquipment = DEMO_EQUIPMENT.filter(
    (e) => e.status === "critical" || e.status === "warning"
  ).slice(0, 4);

  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time operational overview • {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
            LIVE
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2 text-xs"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard
          title="Active Cameras"
          value={stats.active_cameras}
          unit="/8"
          icon={Camera}
          iconColor="text-blue-400"
          status="good"
          trend="stable"
          trendValue={0}
          index={0}
        />
        <KPICard
          title="Active Alerts"
          value={stats.active_alerts}
          icon={AlertTriangle}
          iconColor="text-red-400"
          status="critical"
          trend="up"
          trendValue={25}
          index={1}
        />
        <KPICard
          title="Equip. Health"
          value={stats.equipment_health_avg}
          unit="%"
          icon={Wrench}
          iconColor="text-yellow-400"
          status="warning"
          trend="down"
          trendValue={3}
          index={2}
        />
        <KPICard
          title="Production"
          value={stats.production_efficiency}
          unit="%"
          icon={TrendingUp}
          iconColor="text-emerald-400"
          status="good"
          trend="up"
          trendValue={5}
          index={3}
        />
        <KPICard
          title="PPE Compliance"
          value={stats.ppe_compliance}
          unit="%"
          icon={Shield}
          iconColor="text-purple-400"
          status={stats.ppe_compliance >= 85 ? "good" : "warning"}
          trend="down"
          trendValue={4}
          index={4}
        />
        <KPICard
          title="Energy (kWh)"
          value={stats.energy_consumption.toLocaleString()}
          icon={Zap}
          iconColor="text-cyan-400"
          status="neutral"
          trend="stable"
          trendValue={1}
          index={5}
        />
      </div>

      {/* Second row KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard
          title="Workers On-Site"
          value={stats.workers_detected}
          icon={Users}
          iconColor="text-indigo-400"
          status="neutral"
          index={6}
        />
        <KPICard
          title="Open Work Orders"
          value={stats.open_work_orders}
          icon={Clock}
          iconColor="text-orange-400"
          status="warning"
          index={7}
        />
        <KPICard
          title="System Uptime"
          value={stats.uptime_percent}
          unit="%"
          icon={Activity}
          iconColor="text-emerald-400"
          status="good"
          index={8}
        />
        <KPICard
          title="Incidents Today"
          value={stats.incidents_today}
          icon={AlertCircle}
          iconColor="text-red-400"
          status={stats.incidents_today > 2 ? "warning" : "good"}
          index={9}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Production Efficiency Chart */}
        <Card className="lg:col-span-2 card-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Production Efficiency & Output</CardTitle>
              <Badge variant="secondary" className="text-xs">14 days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <MultiAreaChart
              data={PRODUCTION_DATA}
              xKey="date"
              areas={[
                { dataKey: "efficiency", color: "#10b981", name: "Efficiency %" },
                { dataKey: "output", color: "#0ea5e9", name: "Output (tons)" },
              ]}
              height={180}
            />
          </CardContent>
        </Card>

        {/* Equipment Status */}
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Equipment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={EQUIPMENT_STATUS_DATA}
              height={140}
              label="Total"
              labelValue="9"
            />
            <div className="space-y-2 mt-2">
              {EQUIPMENT_STATUS_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Critical Equipment */}
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Critical Equipment</CardTitle>
              <Badge variant="destructive" className="text-xs">{criticalEquipment.length} issues</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {criticalEquipment.map((equip) => (
                <div
                  key={equip.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 border border-border"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    equip.status === "critical" ? "bg-red-500/10" : "bg-yellow-500/10"
                  )}>
                    <Wrench className={cn(
                      "w-3.5 h-3.5",
                      equip.status === "critical" ? "text-red-400" : "text-yellow-400"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{equip.name}</p>
                    <p className="text-[10px] text-muted-foreground">{equip.location}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={cn("text-xs font-bold", getHealthColor(equip.health_score))}>
                      {equip.health_score}%
                    </p>
                    <p className={cn(
                      "text-[9px] capitalize px-1.5 py-0.5 rounded",
                      getStatusColor(equip.status)
                    )}>
                      {equip.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Recent Alerts</CardTitle>
              <Badge variant="secondary" className="text-xs">{alerts.filter(a => !a.is_acknowledged).length} new</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-start gap-2.5 p-2.5 rounded-lg border text-xs",
                    !alert.is_acknowledged ? "bg-muted/50" : "opacity-60",
                    getSeverityColor(alert.severity)
                  )}
                >
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{alert.title}</p>
                    <p className="text-[10px] opacity-70 mt-0.5">{timeAgo(alert.created_at)}</p>
                  </div>
                  {alert.is_acknowledged ? (
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current mt-1 flex-shrink-0 animate-pulse-dot" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Feed */}
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse-dot" />
                AI Insights
              </CardTitle>
              <Badge className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/30">
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {insights.slice(0, 4).map((insight) => {
                const priorityColors = {
                  high: "text-red-400 bg-red-400/10",
                  medium: "text-yellow-400 bg-yellow-400/10",
                  low: "text-blue-400 bg-blue-400/10",
                };
                const typeColors = {
                  maintenance: "bg-orange-500/10",
                  safety: "bg-yellow-500/10",
                  efficiency: "bg-emerald-500/10",
                  alert: "bg-red-500/10",
                };

                return (
                  <div
                    key={insight.id}
                    className={cn(
                      "p-2.5 rounded-lg border border-border text-xs",
                      typeColors[insight.type] || "bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={cn(
                        "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded",
                        priorityColors[insight.priority]
                      )}>
                        {insight.priority}
                      </span>
                      <span className="text-[10px] text-muted-foreground capitalize">{insight.type}</span>
                    </div>
                    <p className="font-medium text-foreground mb-0.5">{insight.title}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{insight.description}</p>
                    {insight.action && (
                      <p className="text-[10px] text-primary mt-1">→ {insight.action}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Energy & Incidents Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Energy Chart */}
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Energy Consumption (24h)</CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                <span>Actual</span>
                <span className="w-2 h-2 rounded-full bg-border inline-block ml-1" />
                <span>Target</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <MultiAreaChart
              data={ENERGY_DATA}
              xKey="time"
              areas={[
                { dataKey: "consumption", color: "#22d3ee", name: "Consumption (kWh)" },
                { dataKey: "target", color: "#6b7280", name: "Target (kWh)" },
              ]}
              height={160}
            />
          </CardContent>
        </Card>

        {/* Incident Summary */}
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Incidents by Type (This Week)</CardTitle>
              <Badge variant="secondary" className="text-xs">18 total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <DonutChart
                data={INCIDENT_TYPE_DATA}
                height={130}
                label="Total"
                labelValue="18"
              />
              <div className="flex-1 space-y-2.5 py-2">
                {INCIDENT_TYPE_DATA.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(item.value / 18) * 100}%`, background: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Incidents Table */}
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Recent Incidents</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-primary h-7">
              View All →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {DEMO_INCIDENTS.map((incident) => (
              <div
                key={incident.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
              >
                <div className={cn(
                  "w-2 h-10 rounded-full flex-shrink-0",
                  incident.severity === "emergency" ? "bg-red-500" :
                  incident.severity === "critical" ? "bg-orange-500" :
                  incident.severity === "warning" ? "bg-yellow-500" :
                  "bg-blue-500"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{incident.incident_number}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded border capitalize",
                      getSeverityColor(incident.severity)
                    )}>
                      {incident.severity}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-0.5 truncate">{incident.title}</p>
                  <p className="text-[11px] text-muted-foreground">{incident.location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded capitalize",
                    getStatusColor(incident.status)
                  )}>
                    {incident.status}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(incident.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
