"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Play, Pause, Maximize2, Download, AlertTriangle,
  Users, Car, Shield, Flame, Eye, ZoomIn, Grid2X2, Grid3X3,
  LayoutGrid, RefreshCw, Filter, ChevronRight, Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KPICard } from "@/components/dashboard/KPICard";
import { useDashboardStore, useAlertsStore } from "@/store";
import { DEMO_CAMERAS, DEMO_ALERTS } from "@/data/demo";
import { timeAgo, getStatusColor, getSeverityColor } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { Camera as CameraType, AIDetection } from "@/types";

// ============================================================
// Mock AI detection generator
// ============================================================
function generateDetections(cameraId: string): AIDetection[] {
  const camera = DEMO_CAMERAS.find((c) => c.id === cameraId);
  if (!camera) return [];

  const detections: AIDetection[] = [];
  const now = new Date().toISOString();

  if (camera.detection_types.includes("person")) {
    const count = Math.floor(1 + Math.random() * 5);
    for (let i = 0; i < count; i++) {
      detections.push({
        id: `det-${cameraId}-person-${i}`,
        camera_id: cameraId,
        camera_name: camera.name,
        type: "person",
        confidence: 0.85 + Math.random() * 0.14,
        bbox: {
          x: Math.random() * 0.7,
          y: Math.random() * 0.7,
          width: 0.08 + Math.random() * 0.1,
          height: 0.2 + Math.random() * 0.15,
        },
        timestamp: now,
        is_alert: false,
      });
    }
  }

  if (camera.detection_types.includes("vehicle") && Math.random() > 0.5) {
    detections.push({
      id: `det-${cameraId}-vehicle`,
      camera_id: cameraId,
      camera_name: camera.name,
      type: "vehicle",
      confidence: 0.9 + Math.random() * 0.09,
      bbox: { x: 0.1, y: 0.4, width: 0.3, height: 0.25 },
      timestamp: now,
      is_alert: false,
    });
  }

  if (camera.detection_types.includes("ppe_helmet") && Math.random() > 0.7) {
    detections.push({
      id: `det-${cameraId}-ppe`,
      camera_id: cameraId,
      camera_name: camera.name,
      type: "ppe_helmet",
      confidence: 0.78 + Math.random() * 0.2,
      bbox: { x: 0.3, y: 0.1, width: 0.05, height: 0.07 },
      timestamp: now,
      is_alert: true,
    });
  }

  if (camera.id === "cam-2" && Math.random() > 0.8) {
    detections.push({
      id: `det-${cameraId}-smoke`,
      camera_id: cameraId,
      camera_name: camera.name,
      type: "smoke",
      confidence: 0.87,
      timestamp: now,
      is_alert: true,
    });
  }

  return detections;
}

// ============================================================
// Camera Feed Component
// ============================================================
function CameraFeedCard({
  camera,
  isSelected,
  onSelect,
  detections,
}: {
  camera: CameraType;
  isSelected: boolean;
  onSelect: () => void;
  detections: AIDetection[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(camera.status !== "offline");

  // Simulate video frames with canvas
  useEffect(() => {
    if (!canvasRef.current || !isPlaying) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Dark background simulating industrial footage
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, `hsl(${220 + Math.sin(frame * 0.01) * 5}, 30%, ${8 + Math.sin(frame * 0.02) * 2}%)`);
      gradient.addColorStop(1, `hsl(${210 + Math.cos(frame * 0.01) * 5}, 25%, ${6 + Math.cos(frame * 0.02) * 2}%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Simulate industrial scene elements
      // Floor lines
      ctx.strokeStyle = `rgba(100, 120, 140, ${0.15 + Math.sin(frame * 0.03) * 0.05})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, h * 0.4 + i * (h * 0.1));
        ctx.lineTo(w, h * 0.4 + i * (h * 0.1) + Math.sin(frame * 0.01 + i) * 2);
        ctx.stroke();
      }

      // Machinery silhouette
      ctx.fillStyle = `rgba(30, 45, 60, ${0.8 + Math.sin(frame * 0.02) * 0.1})`;
      ctx.fillRect(w * 0.6, h * 0.2, w * 0.35, h * 0.6);
      ctx.fillRect(w * 0.65, h * 0.1, w * 0.05, h * 0.1);

      // Draw AI bounding boxes
      detections.forEach((det) => {
        if (!det.bbox) return;
        const { x, y, width, height } = det.bbox;
        const bx = x * w, by = y * h, bw = width * w, bh = height * h;

        const colors: Record<string, string> = {
          person: "#22d3ee",
          vehicle: "#f59e0b",
          ppe_helmet: "#ef4444",
          ppe_vest: "#f97316",
          fire: "#ef4444",
          smoke: "#94a3b8",
          intrusion: "#8b5cf6",
          motion: "#10b981",
        };
        const color = colors[det.type] || "#ffffff";

        // Box
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bx, by, bw, bh);

        // Corner decorations (cyberpunk style)
        const cs = 6;
        ctx.lineWidth = 2;
        [[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]].forEach(([cx, cy], i) => {
          ctx.beginPath();
          ctx.moveTo(cx + (i % 2 === 0 ? cs : -cs), cy);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx, cy + (i < 2 ? cs : -cs));
          ctx.stroke();
        });

        // Label background
        ctx.fillStyle = color + "cc";
        ctx.fillRect(bx, by - 14, bw < 60 ? 60 : bw, 14);
        ctx.fillStyle = "#000";
        ctx.font = `bold 9px monospace`;
        ctx.fillText(
          `${det.type.toUpperCase().replace("_", " ")} ${(det.confidence * 100).toFixed(0)}%`,
          bx + 3,
          by - 3
        );
      });

      // Timestamp overlay
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, h - 18, w, 18);
      ctx.fillStyle = "#10b981";
      ctx.font = "8px monospace";
      ctx.fillText(`REC  ${new Date().toLocaleTimeString()}  ${camera.resolution}`, 4, h - 5);

      // Scan line effect
      const scanY = (frame * 1.5) % h;
      const scanGrad = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
      scanGrad.addColorStop(0, "rgba(14,165,233,0)");
      scanGrad.addColorStop(0.5, "rgba(14,165,233,0.08)");
      scanGrad.addColorStop(1, "rgba(14,165,233,0)");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 2, w, 4);

    }, 50);

    return () => clearInterval(interval);
  }, [camera, detections, isPlaying]);

  const statusColors: Record<string, string> = {
    recording: "bg-red-500",
    online: "bg-emerald-500",
    alert: "bg-orange-500",
    offline: "bg-slate-500",
  };

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all",
        "bg-black group",
        isSelected ? "border-primary shadow-lg shadow-primary/20" : "border-border hover:border-primary/50"
      )}
      onClick={onSelect}
      style={{ aspectRatio: "16/9" }}
    >
      {camera.status === "offline" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/20">
          <Camera className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground">SIGNAL LOST</p>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          width={320}
          height={180}
        />
      )}

      {/* Status badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 rounded-full px-2 py-1">
        <div className={cn("w-1.5 h-1.5 rounded-full", statusColors[camera.status], "animate-pulse-dot")} />
        <span className="text-[9px] text-white font-mono uppercase">{camera.status}</span>
      </div>

      {/* AI badge */}
      {camera.is_ai_enabled && (
        <div className="absolute top-2 right-2 bg-primary/80 rounded px-1.5 py-0.5">
          <span className="text-[9px] text-white font-bold">AI</span>
        </div>
      )}

      {/* Alert badge */}
      {camera.status === "alert" && (
        <div className="absolute top-8 left-2 bg-orange-500/80 rounded px-1.5 py-0.5 animate-alert-flash">
          <span className="text-[9px] text-white font-bold">⚠ ALERT</span>
        </div>
      )}

      {/* Camera name */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2">
        <p className="text-[10px] text-white font-medium truncate">{camera.name}</p>
        <p className="text-[9px] text-white/60 truncate">{camera.location}</p>
      </div>

      {/* Detection count */}
      {detections.length > 0 && (
        <div className="absolute bottom-8 right-2 bg-cyan-500/80 rounded px-1.5 py-0.5">
          <span className="text-[9px] text-white">{detections.length} detected</span>
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 text-white" /> : <Play className="w-3.5 h-3.5 text-white" />}
        </button>
        <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
          <Maximize2 className="w-3.5 h-3.5 text-white" />
        </button>
        <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
          <Download className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Main Surveillance Page
// ============================================================
export default function SurveillancePage() {
  const [selectedCamera, setSelectedCamera] = useState<string>("cam-1");
  const [gridLayout, setGridLayout] = useState<2 | 4 | 8>(4);
  const [detections, setDetections] = useState<Record<string, AIDetection[]>>({});
  const { stats } = useDashboardStore();
  const { alerts } = useAlertsStore();

  const surveillanceAlerts = alerts.filter((a) => a.source === "surveillance");

  // Update detections every 3 seconds
  useEffect(() => {
    const update = () => {
      const newDetections: Record<string, AIDetection[]> = {};
      DEMO_CAMERAS.forEach((cam) => {
        if (cam.status !== "offline") {
          newDetections[cam.id] = generateDetections(cam.id);
        }
      });
      setDetections(newDetections);
    };
    update();
    const interval = setInterval(update, 3000);
    return () => clearInterval(interval);
  }, []);

  const selectedCam = DEMO_CAMERAS.find((c) => c.id === selectedCamera);
  const displayedCameras = DEMO_CAMERAS.slice(0, gridLayout);

  const allDetections = Object.values(detections).flat();
  const personCount = allDetections.filter((d) => d.type === "person").length;
  const vehicleCount = allDetections.filter((d) => d.type === "vehicle").length;
  const ppeViolations = allDetections.filter((d) => d.type.startsWith("ppe") && d.is_alert).length;
  const fireSmoke = allDetections.filter((d) => d.type === "fire" || d.type === "smoke").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Surveillance Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {DEMO_CAMERAS.filter((c) => c.status !== "offline").length} cameras active • Real-time AI detection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <button
              onClick={() => setGridLayout(2)}
              className={cn("p-1.5 rounded", gridLayout === 2 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <Grid2X2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setGridLayout(4)}
              className={cn("p-1.5 rounded", gridLayout === 4 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setGridLayout(8)}
              className={cn("p-1.5 rounded", gridLayout === 8 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <KPICard title="Active Cameras" value={DEMO_CAMERAS.filter(c => c.status !== "offline").length} unit={`/${DEMO_CAMERAS.length}`} icon={Camera} iconColor="text-blue-400" status="good" index={0} />
        <KPICard title="Active Alerts" value={surveillanceAlerts.filter(a => !a.is_acknowledged).length} icon={AlertTriangle} iconColor="text-red-400" status="critical" index={1} />
        <KPICard title="Persons Detected" value={personCount} icon={Users} iconColor="text-cyan-400" status="neutral" index={2} />
        <KPICard title="PPE Violations" value={ppeViolations} icon={Shield} iconColor="text-orange-400" status={ppeViolations > 0 ? "warning" : "good"} index={3} />
        <KPICard title="Fire/Smoke" value={fireSmoke} icon={Flame} iconColor={fireSmoke > 0 ? "text-red-400" : "text-muted-foreground"} status={fireSmoke > 0 ? "critical" : "good"} index={4} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Camera Grid */}
        <div className="xl:col-span-3 space-y-4">
          <div className={cn(
            "grid gap-2",
            gridLayout === 2 ? "grid-cols-2" :
            gridLayout === 4 ? "grid-cols-2 xl:grid-cols-2" :
            "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
          )}>
            {displayedCameras.map((camera) => (
              <CameraFeedCard
                key={camera.id}
                camera={camera}
                isSelected={selectedCamera === camera.id}
                onSelect={() => setSelectedCamera(camera.id)}
                detections={detections[camera.id] || []}
              />
            ))}
          </div>

          {/* Detection log */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">AI Detection Log</CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <Activity className="w-3 h-3" />
                  Live
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {allDetections.slice(0, 10).map((det) => {
                  const typeColors: Record<string, string> = {
                    person: "text-cyan-400",
                    vehicle: "text-yellow-400",
                    ppe_helmet: "text-red-400",
                    fire: "text-red-500",
                    smoke: "text-slate-400",
                    intrusion: "text-purple-400",
                  };
                  return (
                    <div
                      key={det.id}
                      className="flex items-center gap-3 text-xs py-1.5 border-b border-border last:border-0"
                    >
                      <span className="w-16 text-muted-foreground font-mono text-[10px]">
                        {new Date(det.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={cn("font-medium w-24", typeColors[det.type] || "text-foreground")}>
                        {det.type.replace(/_/g, " ").toUpperCase()}
                      </span>
                      <span className="text-muted-foreground flex-1">{det.camera_name}</span>
                      <span className="text-muted-foreground font-mono">
                        {(det.confidence * 100).toFixed(0)}%
                      </span>
                      {det.is_alert && (
                        <span className="text-red-400 text-[10px] font-bold">ALERT</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Selected camera info */}
          {selectedCam && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Camera Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium mt-0.5">{selectedCam.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium mt-0.5">{selectedCam.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground">Resolution</p>
                    <p className="font-medium mt-0.5">{selectedCam.resolution}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">FPS</p>
                    <p className="font-medium mt-0.5">{selectedCam.fps}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1.5">AI Detections Active</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedCam.detection_types.map((type) => (
                      <span
                        key={type}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                      >
                        {type.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Zone Type</p>
                  <p className="font-medium mt-0.5 capitalize">{selectedCam.zone_type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded capitalize mt-0.5 inline-block", getStatusColor(selectedCam.status))}>
                    {selectedCam.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alert list */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Surveillance Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {surveillanceAlerts.slice(0, 8).map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-2.5 rounded-lg border text-xs",
                        getSeverityColor(alert.severity),
                        !alert.is_acknowledged && "font-medium"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                        <span className="capitalize font-bold">{alert.severity}</span>
                        {!alert.is_acknowledged && (
                          <span className="ml-auto text-[9px] bg-current/20 px-1 rounded">NEW</span>
                        )}
                      </div>
                      <p className="line-clamp-2">{alert.title}</p>
                      <p className="text-[10px] opacity-70 mt-1">{timeAgo(alert.created_at)}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Camera list */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">All Cameras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {DEMO_CAMERAS.map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => setSelectedCamera(cam.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 p-2 rounded-lg text-xs transition-colors text-left",
                      selectedCamera === cam.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                    )}
                  >
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full flex-shrink-0",
                      cam.status === "recording" ? "bg-red-500 animate-pulse-dot" :
                      cam.status === "alert" ? "bg-orange-500 animate-pulse-dot" :
                      cam.status === "online" ? "bg-emerald-500" :
                      "bg-slate-500"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{cam.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{cam.zone_type}</p>
                    </div>
                    {cam.is_ai_enabled && (
                      <span className="text-[9px] text-primary">AI</span>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
