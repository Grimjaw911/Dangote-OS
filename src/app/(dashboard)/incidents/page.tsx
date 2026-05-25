"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, Plus, Filter, Search, ChevronRight, Clock,
  User, MapPin, FileText, Zap, CheckCircle2, Circle,
  AlertCircle, Shield, Wrench, Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KPICard } from "@/components/dashboard/KPICard";
import { DEMO_INCIDENTS, DEMO_ALERTS } from "@/data/demo";
import { timeAgo, formatDateTime, getSeverityColor, getStatusColor } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { Incident } from "@/types";
import { useAlertsStore } from "@/store";

function IncidentCard({
  incident,
  isSelected,
  onSelect,
}: {
  incident: Incident;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const typeIcons: Record<string, React.ElementType> = {
    equipment_failure: Wrench,
    safety_violation: Shield,
    security_breach: AlertTriangle,
    environmental: Activity,
    process: Zap,
  };
  const TypeIcon = typeIcons[incident.type] || AlertCircle;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-xl border-2 transition-all",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40 bg-card hover:bg-muted/20"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
          incident.severity === "emergency" ? "bg-red-500/15" :
          incident.severity === "critical" ? "bg-orange-500/15" :
          incident.severity === "warning" ? "bg-yellow-500/15" :
          "bg-blue-500/15"
        )}>
          <TypeIcon className={cn(
            "w-4.5 h-4.5",
            incident.severity === "emergency" ? "text-red-400" :
            incident.severity === "critical" ? "text-orange-400" :
            incident.severity === "warning" ? "text-yellow-400" :
            "text-blue-400"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-muted-foreground">{incident.incident_number}</span>
            <span className={cn(
              "text-[9px] px-1.5 py-0.5 rounded border capitalize font-medium",
              getSeverityColor(incident.severity)
            )}>
              {incident.severity}
            </span>
          </div>
          <p className="text-sm font-semibold truncate">{incident.title}</p>
          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {incident.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(incident.created_at)}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className={cn(
            "text-[10px] px-2 py-1 rounded capitalize",
            getStatusColor(incident.status)
          )}>
            {incident.status}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function IncidentsPage() {
  const [selectedId, setSelectedId] = useState<string>("inc-1");
  const [search, setSearch] = useState("");
  const { alerts, acknowledgeAlert } = useAlertsStore();

  const selectedIncident = DEMO_INCIDENTS.find((i) => i.id === selectedId);

  const filteredIncidents = DEMO_INCIDENTS.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.incident_number.toLowerCase().includes(search.toLowerCase())
  );

  const openCount = DEMO_INCIDENTS.filter((i) => i.status === "open").length;
  const investigatingCount = DEMO_INCIDENTS.filter((i) => i.status === "investigating").length;
  const emergencyCount = DEMO_INCIDENTS.filter((i) => i.severity === "emergency").length;
  const unackAlerts = alerts.filter((a) => !a.is_acknowledged).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Incident Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track, investigate, and resolve operational incidents
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Report Incident
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard title="Open Incidents" value={openCount} icon={Circle} iconColor="text-blue-400" status="warning" index={0} />
        <KPICard title="Investigating" value={investigatingCount} icon={AlertCircle} iconColor="text-yellow-400" status="warning" index={1} />
        <KPICard title="Emergency" value={emergencyCount} icon={AlertTriangle} iconColor="text-red-400" status={emergencyCount > 0 ? "critical" : "good"} index={2} />
        <KPICard title="Unack. Alerts" value={unackAlerts} icon={AlertCircle} iconColor="text-orange-400" status={unackAlerts > 0 ? "warning" : "good"} index={3} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Incident list */}
        <div className="xl:col-span-2 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search incidents..."
              className="pl-9 h-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[calc(100vh-380px)]">
            <div className="space-y-2 pr-1">
              {filteredIncidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  isSelected={selectedId === incident.id}
                  onSelect={() => setSelectedId(incident.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Incident detail */}
        <div className="xl:col-span-3 space-y-4">
          {selectedIncident ? (
            <>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm font-mono text-muted-foreground">{selectedIncident.incident_number}</span>
                        <span className={cn("text-xs px-2 py-0.5 rounded border capitalize", getSeverityColor(selectedIncident.severity))}>
                          {selectedIncident.severity}
                        </span>
                        <span className={cn("text-xs px-2 py-0.5 rounded capitalize", getStatusColor(selectedIncident.status))}>
                          {selectedIncident.status}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                          {selectedIncident.type.replace(/_/g, " ")}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold">{selectedIncident.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{selectedIncident.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    <div className="p-2.5 rounded-lg bg-muted/50 text-xs">
                      <p className="text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                      <p className="font-medium mt-0.5">{selectedIncident.location}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/50 text-xs">
                      <p className="text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> Reported By</p>
                      <p className="font-medium mt-0.5">{selectedIncident.reporter_name}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/50 text-xs">
                      <p className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Reported</p>
                      <p className="font-medium mt-0.5">{timeAgo(selectedIncident.created_at)}</p>
                    </div>
                    {selectedIncident.assignee_name && (
                      <div className="p-2.5 rounded-lg bg-muted/50 text-xs">
                        <p className="text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> Assigned To</p>
                        <p className="font-medium mt-0.5">{selectedIncident.assignee_name}</p>
                      </div>
                    )}
                    <div className="p-2.5 rounded-lg bg-muted/50 text-xs">
                      <p className="text-muted-foreground">Escalation Level</p>
                      <p className="font-medium mt-0.5">Level {selectedIncident.escalation_level}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/50 text-xs">
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-medium mt-0.5">{timeAgo(selectedIncident.updated_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Summary */}
              {selectedIncident.ai_summary && (
                <Card className="border-purple-500/20 bg-purple-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      AI Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedIncident.ai_summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Incident Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedIncident.timeline && selectedIncident.timeline.length > 0 ? (
                    <div className="space-y-3">
                      {selectedIncident.timeline.map((event, i) => (
                        <div key={event.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                              {event.type === "created" ? <Plus className="w-3 h-3 text-primary" /> :
                               event.type === "resolved" ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> :
                               <ChevronRight className="w-3 h-3 text-primary" />}
                            </div>
                            {i < (selectedIncident.timeline?.length || 0) - 1 && (
                              <div className="w-0.5 h-full min-h-4 bg-border mt-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <p className="text-xs font-medium capitalize">{event.type}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                              <span>{event.user_name}</span>
                              <span>•</span>
                              <span>{formatDateTime(event.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No timeline events yet.</p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Select an incident to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert Management */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Alert Center</CardTitle>
            <Badge variant="secondary" className="text-xs">{unackAlerts} unacknowledged</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {alerts.slice(0, 6).map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-xl border transition-all",
                  getSeverityColor(alert.severity),
                  alert.is_acknowledged ? "opacity-50" : ""
                )}
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">{alert.title}</p>
                  <p className="text-[11px] opacity-80 truncate">{alert.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] opacity-70">{timeAgo(alert.created_at)}</span>
                  {!alert.is_acknowledged && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px] px-2 opacity-80 hover:opacity-100"
                      onClick={() => acknowledgeAlert(alert.id, "user-1")}
                    >
                      Acknowledge
                    </Button>
                  )}
                  {alert.is_acknowledged && (
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
