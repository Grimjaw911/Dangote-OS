// ============================================================
// DANGOTE PREDICTIVE MAINTENANCE & SURVEILLANCE OS
// Core Type Definitions
// ============================================================

export type UserRole =
  | "admin"
  | "plant_manager"
  | "maintenance_engineer"
  | "security_officer"
  | "operator"
  | "auditor";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  plant_id?: string;
  avatar_url?: string;
  is_active: boolean;
  last_seen?: string;
  created_at: string;
}

export interface Plant {
  id: string;
  name: string;
  location: string;
  type: "cement" | "manufacturing" | "logistics" | "power";
  status: "operational" | "maintenance" | "offline";
  efficiency: number;
  created_at: string;
}

// ============================================================
// EQUIPMENT & MAINTENANCE
// ============================================================

export type EquipmentStatus = "operational" | "warning" | "critical" | "offline" | "maintenance";
export type EquipmentType =
  | "kiln_motor"
  | "crusher"
  | "conveyor"
  | "power_turbine"
  | "hydraulic_system"
  | "cooling_fan"
  | "cement_mill"
  | "compressor"
  | "pump"
  | "generator";

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  plant_id: string;
  location: string;
  status: EquipmentStatus;
  health_score: number; // 0-100
  install_date: string;
  last_maintenance: string;
  next_maintenance: string;
  rul_hours: number; // remaining useful life in hours
  model_number: string;
  manufacturer: string;
  criticality: "low" | "medium" | "high" | "critical";
  created_at: string;
}

export interface SensorReading {
  id: string;
  equipment_id: string;
  timestamp: string;
  temperature: number; // Celsius
  pressure: number; // Bar
  vibration: number; // mm/s
  rpm: number;
  current: number; // Amperes
  voltage?: number;
  oil_level?: number;
  noise_level?: number;
  anomaly_score: number; // 0-1
  is_anomaly: boolean;
}

export interface MaintenanceLog {
  id: string;
  equipment_id: string;
  work_order_id?: string;
  type: "preventive" | "corrective" | "predictive" | "emergency";
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  description: string;
  technician_id: string;
  technician_name: string;
  started_at?: string;
  completed_at?: string;
  scheduled_at: string;
  cost?: number;
  parts_used?: string[];
  notes?: string;
  created_at: string;
}

export interface WorkOrder {
  id: string;
  wo_number: string;
  equipment_id: string;
  equipment_name: string;
  priority: "low" | "medium" | "high" | "critical";
  type: "preventive" | "corrective" | "predictive" | "emergency";
  status: "open" | "assigned" | "in_progress" | "completed" | "cancelled";
  title: string;
  description: string;
  assigned_to?: string;
  assignee_name?: string;
  estimated_hours?: number;
  actual_hours?: number;
  due_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// SURVEILLANCE
// ============================================================

export type CameraStatus = "online" | "offline" | "recording" | "alert";
export type DetectionType =
  | "person"
  | "vehicle"
  | "ppe_helmet"
  | "ppe_vest"
  | "ppe_gloves"
  | "ppe_boots"
  | "fire"
  | "smoke"
  | "intrusion"
  | "motion"
  | "license_plate"
  | "face";

export interface Camera {
  id: string;
  name: string;
  location: string;
  plant_id: string;
  status: CameraStatus;
  stream_url?: string;
  resolution: string;
  fps: number;
  is_ai_enabled: boolean;
  detection_types: DetectionType[];
  zone_type: "entry" | "production" | "storage" | "restricted" | "parking" | "perimeter";
  is_recording: boolean;
  last_alert?: string;
  created_at: string;
}

export interface AIDetection {
  id: string;
  camera_id: string;
  camera_name: string;
  type: DetectionType;
  confidence: number; // 0-1
  bbox?: { x: number; y: number; width: number; height: number };
  timestamp: string;
  frame_url?: string;
  is_alert: boolean;
  alert_id?: string;
  metadata?: Record<string, unknown>;
}

export interface DetectionStats {
  persons: number;
  vehicles: number;
  ppe_violations: number;
  fire_smoke: number;
  intrusions: number;
  compliance_rate: number;
}

// ============================================================
// INCIDENTS & ALERTS
// ============================================================

export type AlertSeverity = "info" | "warning" | "critical" | "emergency";
export type IncidentStatus = "open" | "investigating" | "resolved" | "closed";

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  source: "surveillance" | "maintenance" | "sensor" | "manual" | "ai";
  source_id?: string;
  plant_id: string;
  is_acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  created_at: string;
}

export interface Incident {
  id: string;
  incident_number: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: IncidentStatus;
  type: "equipment_failure" | "safety_violation" | "security_breach" | "environmental" | "process";
  plant_id: string;
  location: string;
  reported_by: string;
  reporter_name: string;
  assigned_to?: string;
  assignee_name?: string;
  ai_summary?: string;
  evidence_urls?: string[];
  timeline?: IncidentTimelineEvent[];
  escalation_level: number;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface IncidentTimelineEvent {
  id: string;
  incident_id: string;
  type: "created" | "updated" | "escalated" | "comment" | "resolved" | "closed";
  description: string;
  user_id: string;
  user_name: string;
  timestamp: string;
}

// ============================================================
// ANALYTICS & REPORTING
// ============================================================

export interface KPIMetric {
  label: string;
  value: number | string;
  unit?: string;
  trend: "up" | "down" | "stable";
  trend_value?: number;
  status: "good" | "warning" | "critical";
  icon?: string;
}

export interface ProductionMetrics {
  efficiency: number;
  output_tons: number;
  energy_kwh: number;
  downtime_hours: number;
  oee: number; // Overall Equipment Effectiveness
  quality_rate: number;
  timestamp: string;
}

export interface Report {
  id: string;
  title: string;
  type: "daily" | "weekly" | "monthly" | "custom" | "incident" | "maintenance" | "safety";
  status: "generating" | "ready" | "failed";
  generated_by: string;
  plant_id?: string;
  date_range_start: string;
  date_range_end: string;
  file_url?: string;
  created_at: string;
}

// ============================================================
// AI ENGINE
// ============================================================

export interface AnomalyPrediction {
  equipment_id: string;
  equipment_name: string;
  anomaly_score: number;
  failure_probability: number;
  predicted_failure_date?: string;
  rul_hours: number;
  recommendation: string;
  confidence: number;
  features: {
    temperature_anomaly: boolean;
    vibration_anomaly: boolean;
    pressure_anomaly: boolean;
    current_anomaly: boolean;
  };
}

export interface AIInsight {
  id: string;
  type: "maintenance" | "safety" | "efficiency" | "alert";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  action?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

// ============================================================
// DASHBOARD
// ============================================================

export interface DashboardStats {
  active_cameras: number;
  active_alerts: number;
  security_risk_score: number;
  workers_detected: number;
  ppe_compliance: number;
  equipment_health_avg: number;
  critical_equipment: number;
  open_work_orders: number;
  production_efficiency: number;
  energy_consumption: number;
  incidents_today: number;
  uptime_percent: number;
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// ============================================================
// NOTIFICATION
// ============================================================

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "alert" | "maintenance" | "incident" | "system" | "ai";
  severity: AlertSeverity;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

// ============================================================
// AUTH
// ============================================================

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  full_name: string;
  role: UserRole;
  plant_id?: string;
}

// ============================================================
// API RESPONSE
// ============================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
