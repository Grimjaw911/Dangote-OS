"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wrench, AlertTriangle, Clock, Activity, TrendingDown,
  CheckCircle2, XCircle, ChevronRight, Plus, Filter,
  ThermometerSun, Gauge, Zap, Wind, Battery, BarChart3,
  Calendar, User, AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KPICard } from "@/components/dashboard/KPICard";
import { SensorChart } from "@/components/charts/SensorChart";
import { ProductionBarChart } from "@/components/charts/ProductionChart";
import {
  DEMO_EQUIPMENT, DEMO_WORK_ORDERS, DEMO_MAINTENANCE_LOGS,
  generateSensorData,
} from "@/data/demo";
import { toast } from "sonner";
import {
  getHealthColor, getHealthBg, getSeverityColor, getStatusColor,
  timeAgo, formatDate,
} from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { Equipment, SensorReading, WorkOrder } from "@/types";

function HealthBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", getHealthBg(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("text-xs font-bold w-8 text-right", getHealthColor(score))}>
        {score}%
      </span>
    </div>
  );
}

function EquipmentCard({
  equipment,
  isSelected,
  onSelect,
}: {
  equipment: Equipment;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const statusConfig = {
    operational: { label: "Operational", dot: "bg-emerald-400", bg: "border-emerald-500/20" },
    warning: { label: "Warning", dot: "bg-yellow-400 animate-pulse-dot", bg: "border-yellow-500/30" },
    critical: { label: "Critical", dot: "bg-red-500 animate-pulse-dot", bg: "border-red-500/30" },
    maintenance: { label: "Maintenance", dot: "bg-blue-400", bg: "border-blue-500/20" },
    offline: { label: "Offline", dot: "bg-slate-500", bg: "border-slate-500/20" },
  };
  const cfg = statusConfig[equipment.status];

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-3 rounded-xl border-2 transition-all duration-200",
        "hover:shadow-md",
        isSelected
          ? "border-primary bg-primary/5 shadow-primary/10 shadow-lg"
          : `${cfg.bg} bg-card hover:bg-muted/30`
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
          equipment.status === "critical" ? "bg-red-500/10" :
          equipment.status === "warning" ? "bg-yellow-500/10" :
          "bg-muted"
        )}>
          <Wrench className={cn(
            "w-4 h-4",
            equipment.status === "critical" ? "text-red-400" :
            equipment.status === "warning" ? "text-yellow-400" :
            "text-muted-foreground"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-semibold truncate">{equipment.name}</p>
            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
          </div>
          <p className="text-[10px] text-muted-foreground mb-2">{equipment.location}</p>
          <HealthBar score={equipment.health_score} />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-muted-foreground">
              RUL: {equipment.rul_hours.toLocaleString()}h
            </span>
            <span className={cn(
              "text-[9px] px-1.5 py-0.5 rounded capitalize font-medium",
              equipment.criticality === "critical" ? "bg-red-500/10 text-red-400" :
              equipment.criticality === "high" ? "bg-orange-500/10 text-orange-400" :
              "bg-muted text-muted-foreground"
            )}>
              {equipment.criticality}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function SensorGauge({
  label,
  value,
  unit,
  min,
  max,
  threshold,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  threshold?: number;
  icon: React.ElementType;
  color: string;
}) {
  const pct = Math.min(100, ((value - min) / (max - min)) * 100);
  const isAlert = threshold ? value > threshold : false;

  return (
    <div className={cn(
      "p-3 rounded-xl border bg-card",
      isAlert ? "border-red-500/30 bg-red-500/5" : "border-border"
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("w-3.5 h-3.5", isAlert ? "text-red-400" : color)} />
        <span className="text-xs text-muted-foreground">{label}</span>
        {isAlert && <AlertTriangle className="w-3 h-3 text-red-400 ml-auto animate-pulse-dot" />}
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={cn("text-xl font-bold", isAlert ? "text-red-400" : "text-foreground")}>
          {value.toFixed(1)}
        </span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", isAlert ? "bg-red-500" : "")}
          style={{ width: `${pct}%`, background: isAlert ? "" : color }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-muted-foreground">{min}{unit}</span>
        <span className="text-[9px] text-muted-foreground">{max}{unit}</span>
      </div>
    </div>
  );
}

const EMPTY_FORM = {
  title: "",
  equipment_id: "equip-1",
  priority: "medium" as WorkOrder["priority"],
  type: "preventive" as WorkOrder["type"],
  assignee_name: "",
  due_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  description: "",
};

export default function MaintenancePage() {
  const [selectedEquipId, setSelectedEquipId] = useState("equip-1");
  const [sensorHistory, setSensorHistory] = useState<SensorReading[]>([]);
  const [liveReadings, setLiveReadings] = useState<SensorReading | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(DEMO_WORK_ORDERS);
  const [woDialogOpen, setWoDialogOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function handleCreateWO(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const equip = DEMO_EQUIPMENT.find((eq) => eq.id === form.equipment_id)!;
    const newWO: WorkOrder = {
      id: `wo-${Date.now()}`,
      wo_number: `WO-${new Date().getFullYear()}-${String(workOrders.length + 1).padStart(4, "0")}`,
      equipment_id: form.equipment_id,
      equipment_name: equip.name,
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      priority: form.priority,
      status: "open",
      assignee_name: form.assignee_name.trim() || undefined,
      due_date: new Date(form.due_date).toISOString(),
      created_by: "current-user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setWorkOrders((prev) => [newWO, ...prev]);
    toast.success(`Work order ${newWO.wo_number} created`);
    setWoDialogOpen(false);
    setForm(EMPTY_FORM);
  }

  const selectedEquip = DEMO_EQUIPMENT.find((e) => e.id === selectedEquipId)!;

  useEffect(() => {
    const data = generateSensorData(selectedEquipId, 12);
    setSensorHistory(data);
    setLiveReadings(data[data.length - 1]);
  }, [selectedEquipId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newReadings = generateSensorData(selectedEquipId, 1);
      setLiveReadings(newReadings[newReadings.length - 1]);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedEquipId]);

  const criticalCount = DEMO_EQUIPMENT.filter((e) => e.status === "critical").length;
  const warningCount = DEMO_EQUIPMENT.filter((e) => e.status === "warning").length;
  const avgHealth = Math.round(
    DEMO_EQUIPMENT.reduce((acc, e) => acc + e.health_score, 0) / DEMO_EQUIPMENT.length
  );
  const openWO = workOrders.filter((w) => w.status !== "completed" && w.status !== "cancelled").length;

  // Format sensor history for chart
  const tempChartData = sensorHistory.map((r, i) => ({
    timestamp: i % 10 === 0 ? new Date(r.timestamp).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }) : "",
    value: r.temperature,
  }));
  const vibrationChartData = sensorHistory.map((r, i) => ({
    timestamp: i % 10 === 0 ? new Date(r.timestamp).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }) : "",
    value: r.vibration,
  }));
  const anomalyChartData = sensorHistory.map((r, i) => ({
    timestamp: i % 10 === 0 ? new Date(r.timestamp).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }) : "",
    value: r.anomaly_score * 100,
  }));

  const priorityConfig = {
    critical: "bg-red-500/10 text-red-400 border-red-500/30",
    high: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    low: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  };

  const woStatusConfig = {
    open: "bg-blue-500/10 text-blue-400",
    assigned: "bg-indigo-500/10 text-indigo-400",
    in_progress: "bg-yellow-500/10 text-yellow-400",
    completed: "bg-emerald-500/10 text-emerald-400",
    cancelled: "bg-muted text-muted-foreground",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Predictive Maintenance</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered equipment health monitoring & failure prediction
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setWoDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          New Work Order
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard title="Avg Fleet Health" value={avgHealth} unit="%" icon={Activity} iconColor="text-emerald-400" status={avgHealth >= 80 ? "good" : "warning"} trend="down" trendValue={3} index={0} />
        <KPICard title="Critical Equip." value={criticalCount} icon={AlertTriangle} iconColor="text-red-400" status="critical" index={1} />
        <KPICard title="Warning Equip." value={warningCount} icon={AlertCircle} iconColor="text-yellow-400" status="warning" index={2} />
        <KPICard title="Open Work Orders" value={openWO} icon={Clock} iconColor="text-blue-400" status="neutral" index={3} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Equipment list */}
        <div className="xl:col-span-1 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Equipment ({DEMO_EQUIPMENT.length})
          </p>
          <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {DEMO_EQUIPMENT.map((equip) => (
              <EquipmentCard
                key={equip.id}
                equipment={equip}
                isSelected={selectedEquipId === equip.id}
                onSelect={() => setSelectedEquipId(equip.id)}
              />
            ))}
          </div>
        </div>

        {/* Equipment detail */}
        <div className="xl:col-span-3 space-y-4">
          {/* Equipment header */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold">{selectedEquip.name}</h2>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded border capitalize",
                      getStatusColor(selectedEquip.status)
                    )}>
                      {selectedEquip.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedEquip.location} • {selectedEquip.manufacturer} {selectedEquip.model_number}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={cn("text-3xl font-bold", getHealthColor(selectedEquip.health_score))}>
                    {selectedEquip.health_score}%
                  </p>
                  <p className="text-xs text-muted-foreground">Health Score</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">Remaining Life</p>
                  <p className="font-bold text-sm mt-0.5">{selectedEquip.rul_hours.toLocaleString()}h</p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">Last Maintenance</p>
                  <p className="font-bold mt-0.5">{formatDate(selectedEquip.last_maintenance)}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">Next Scheduled</p>
                  <p className="font-bold mt-0.5">{formatDate(selectedEquip.next_maintenance)}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">Criticality</p>
                  <p className={cn("font-bold capitalize mt-0.5",
                    selectedEquip.criticality === "critical" ? "text-red-400" :
                    selectedEquip.criticality === "high" ? "text-orange-400" :
                    "text-foreground"
                  )}>
                    {selectedEquip.criticality}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sensor gauges */}
          {liveReadings && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <SensorGauge
                label="Temperature"
                value={liveReadings.temperature}
                unit="°C"
                min={20}
                max={120}
                threshold={95}
                icon={ThermometerSun}
                color="#f97316"
              />
              <SensorGauge
                label="Vibration"
                value={liveReadings.vibration}
                unit="mm/s"
                min={0}
                max={20}
                threshold={8}
                icon={Activity}
                color="#8b5cf6"
              />
              <SensorGauge
                label="RPM"
                value={liveReadings.rpm}
                unit="rpm"
                min={0}
                max={3600}
                icon={Gauge}
                color="#0ea5e9"
              />
              <SensorGauge
                label="Current"
                value={liveReadings.current}
                unit="A"
                min={0}
                max={600}
                icon={Zap}
                color="#10b981"
              />
              <SensorGauge
                label="Pressure"
                value={liveReadings.pressure}
                unit="bar"
                min={0}
                max={30}
                threshold={20}
                icon={Wind}
                color="#06b6d4"
              />
            </div>
          )}

          {/* Charts */}
          <Tabs defaultValue="sensors">
            <TabsList className="h-8">
              <TabsTrigger value="sensors" className="text-xs">Sensor Trends</TabsTrigger>
              <TabsTrigger value="anomaly" className="text-xs">Anomaly Score</TabsTrigger>
              <TabsTrigger value="workorders" className="text-xs">Work Orders</TabsTrigger>
              <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
            </TabsList>

            <TabsContent value="sensors" className="mt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs">Temperature (°C)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SensorChart
                      data={tempChartData}
                      color="#f97316"
                      unit="°C"
                      threshold={95}
                      thresholdLabel="Limit 95°C"
                      height={120}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs">Vibration (mm/s)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SensorChart
                      data={vibrationChartData}
                      color="#8b5cf6"
                      unit="mm/s"
                      threshold={selectedEquipId === "equip-2" ? 8 : undefined}
                      height={120}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="anomaly" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs">AI Anomaly Score (%)</CardTitle>
                    {selectedEquipId === "equip-2" && (
                      <Badge variant="destructive" className="text-xs">High Anomaly Detected</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <SensorChart
                    data={anomalyChartData}
                    color="#ef4444"
                    unit="%"
                    threshold={70}
                    thresholdLabel="Alert"
                    height={160}
                  />
                  <div className="mt-3 p-3 rounded-lg bg-muted/50 text-xs">
                    <p className="font-semibold mb-1">AI Prediction</p>
                    {selectedEquipId === "equip-2" ? (
                      <p className="text-red-400">
                        ⚠️ High probability of bearing failure within 24-48 hours (89% confidence).
                        Vibration signature consistent with advanced wear. Immediate maintenance recommended.
                      </p>
                    ) : (
                      <p className="text-muted-foreground">
                        ✅ No significant anomalies detected. Equipment operating within normal parameters.
                        Next scheduled maintenance: {formatDate(selectedEquip.next_maintenance)}.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workorders" className="mt-4">
              <div className="space-y-2">
                {workOrders.slice(0, 8).map((wo) => (
                  <div
                    key={wo.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className={cn(
                      "text-[9px] font-bold px-1.5 py-2 rounded border writing-mode-vertical",
                      priorityConfig[wo.priority]
                    )}>
                      {wo.priority.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground">{wo.wo_number}</span>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded capitalize", woStatusConfig[wo.status])}>
                          {wo.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-xs font-medium mt-0.5 truncate">{wo.title}</p>
                      <p className="text-[10px] text-muted-foreground">{wo.equipment_name}</p>
                    </div>
                    <div className="text-right shrink-0 text-xs">
                      <p className="text-muted-foreground">Due</p>
                      <p className="font-medium">{formatDate(wo.due_date)}</p>
                      {wo.assignee_name && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">{wo.assignee_name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <div className="space-y-3">
                {DEMO_MAINTENANCE_LOGS.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl border border-border bg-card">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-2 h-full min-h-[40px] rounded-full shrink-0",
                        log.type === "preventive" ? "bg-blue-500" :
                        log.type === "corrective" ? "bg-orange-500" :
                        log.type === "predictive" ? "bg-purple-500" :
                        "bg-red-500"
                      )} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold capitalize">{log.type} Maintenance</span>
                          <Badge variant={log.status === "completed" ? "default" : "secondary"} className="text-[10px]">
                            {log.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{log.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {log.technician_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(log.scheduled_at)}
                          </span>
                          {log.cost && (
                            <span>Cost: ₦{log.cost.toLocaleString()}</span>
                          )}
                        </div>
                        {log.parts_used && log.parts_used.length > 0 && (
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {log.parts_used.map((part) => (
                              <span key={part} className="text-[9px] bg-muted px-1.5 py-0.5 rounded">{part}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* New Work Order Dialog */}
      <Dialog open={woDialogOpen} onOpenChange={setWoDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Work Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateWO} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="wo-title" className="text-xs">Title *</Label>
              <Input
                id="wo-title"
                placeholder="e.g. Replace bearing on Crusher C2"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="h-9 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="wo-equipment" className="text-xs">Equipment *</Label>
                <select
                  id="wo-equipment"
                  value={form.equipment_id}
                  onChange={(e) => setForm((f) => ({ ...f, equipment_id: e.target.value }))}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {DEMO_EQUIPMENT.map((eq) => (
                    <option key={eq.id} value={eq.id}>{eq.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wo-type" className="text-xs">Type *</Label>
                <select
                  id="wo-type"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as WorkOrder["type"] }))}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="preventive">Preventive</option>
                  <option value="corrective">Corrective</option>
                  <option value="predictive">Predictive</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="wo-priority" className="text-xs">Priority *</Label>
                <select
                  id="wo-priority"
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as WorkOrder["priority"] }))}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wo-due" className="text-xs">Due Date *</Label>
                <Input
                  id="wo-due"
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                  className="h-9 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wo-assignee" className="text-xs">Assigned To</Label>
              <Input
                id="wo-assignee"
                placeholder="Technician name (optional)"
                value={form.assignee_name}
                onChange={(e) => setForm((f) => ({ ...f, assignee_name: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wo-desc" className="text-xs">Description</Label>
              <textarea
                id="wo-desc"
                rows={3}
                placeholder="Describe the work to be done..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Work Order
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
