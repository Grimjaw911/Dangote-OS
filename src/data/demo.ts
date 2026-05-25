// ============================================================
// DANGOTE OS - Demo Data Generator
// All simulated data for demo mode
// ============================================================

import type {
  Equipment,
  Camera,
  Alert,
  Incident,
  WorkOrder,
  AIInsight,
  User,
  Plant,
  SensorReading,
  MaintenanceLog,
  Notification,
} from "@/types";

// ============================================================
// PLANTS
// ============================================================

export const DEMO_PLANTS: Plant[] = [
  {
    id: "plant-1",
    name: "Dangote Cement - Obajana",
    location: "Kogi State, Nigeria",
    type: "cement",
    status: "operational",
    efficiency: 87,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "plant-2",
    name: "Dangote Industries - Lagos",
    location: "Lagos, Nigeria",
    type: "manufacturing",
    status: "operational",
    efficiency: 92,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "plant-3",
    name: "Dangote Power - Abuja",
    location: "FCT, Nigeria",
    type: "power",
    status: "maintenance",
    efficiency: 73,
    created_at: "2023-01-01T00:00:00Z",
  },
];

// ============================================================
// USERS
// ============================================================

export const DEMO_USERS: User[] = [
  {
    id: "user-1",
    email: "admin@dangote.com",
    full_name: "Aliko Dangote",
    role: "admin",
    plant_id: "plant-1",
    is_active: true,
    last_seen: new Date().toISOString(),
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    email: "manager@dangote.com",
    full_name: "Emeka Okonkwo",
    role: "plant_manager",
    plant_id: "plant-1",
    is_active: true,
    last_seen: new Date(Date.now() - 300000).toISOString(),
    created_at: "2023-02-01T00:00:00Z",
  },
  {
    id: "user-3",
    email: "engineer@dangote.com",
    full_name: "Chidi Nwachukwu",
    role: "maintenance_engineer",
    plant_id: "plant-1",
    is_active: true,
    last_seen: new Date(Date.now() - 900000).toISOString(),
    created_at: "2023-02-15T00:00:00Z",
  },
  {
    id: "user-4",
    email: "security@dangote.com",
    full_name: "Ibrahim Musa",
    role: "security_officer",
    plant_id: "plant-1",
    is_active: true,
    last_seen: new Date(Date.now() - 1800000).toISOString(),
    created_at: "2023-03-01T00:00:00Z",
  },
  {
    id: "user-5",
    email: "operator@dangote.com",
    full_name: "Fatima Abubakar",
    role: "operator",
    plant_id: "plant-2",
    is_active: true,
    last_seen: new Date(Date.now() - 3600000).toISOString(),
    created_at: "2023-03-15T00:00:00Z",
  },
];

// ============================================================
// EQUIPMENT
// ============================================================

export const DEMO_EQUIPMENT: Equipment[] = [
  {
    id: "equip-1",
    name: "Kiln Motor A1",
    type: "kiln_motor",
    plant_id: "plant-1",
    location: "Kiln Bay 1",
    status: "operational",
    health_score: 87,
    install_date: "2020-03-15",
    last_maintenance: "2024-11-20",
    next_maintenance: "2025-02-20",
    rul_hours: 4320,
    model_number: "KM-2400-XL",
    manufacturer: "Siemens",
    criticality: "critical",
    created_at: "2020-03-15T00:00:00Z",
  },
  {
    id: "equip-2",
    name: "Primary Crusher C2",
    type: "crusher",
    plant_id: "plant-1",
    location: "Crushing Unit 2",
    status: "warning",
    health_score: 62,
    install_date: "2019-06-10",
    last_maintenance: "2024-09-05",
    next_maintenance: "2025-01-05",
    rul_hours: 1440,
    model_number: "CR-1800",
    manufacturer: "Metso",
    criticality: "high",
    created_at: "2019-06-10T00:00:00Z",
  },
  {
    id: "equip-3",
    name: "Conveyor Belt B3",
    type: "conveyor",
    plant_id: "plant-1",
    location: "Transfer Station 3",
    status: "operational",
    health_score: 94,
    install_date: "2021-01-20",
    last_maintenance: "2024-12-01",
    next_maintenance: "2025-03-01",
    rul_hours: 7200,
    model_number: "CB-600",
    manufacturer: "ABB",
    criticality: "medium",
    created_at: "2021-01-20T00:00:00Z",
  },
  {
    id: "equip-4",
    name: "Power Turbine T1",
    type: "power_turbine",
    plant_id: "plant-3",
    location: "Power House",
    status: "critical",
    health_score: 38,
    install_date: "2018-08-01",
    last_maintenance: "2024-07-15",
    next_maintenance: "2025-01-15",
    rul_hours: 480,
    model_number: "PT-GE-9E",
    manufacturer: "GE",
    criticality: "critical",
    created_at: "2018-08-01T00:00:00Z",
  },
  {
    id: "equip-5",
    name: "Hydraulic System H2",
    type: "hydraulic_system",
    plant_id: "plant-1",
    location: "Hydraulics Bay",
    status: "maintenance",
    health_score: 55,
    install_date: "2020-11-30",
    last_maintenance: "2025-01-10",
    next_maintenance: "2025-04-10",
    rul_hours: 2880,
    model_number: "HYD-400",
    manufacturer: "Parker",
    criticality: "high",
    created_at: "2020-11-30T00:00:00Z",
  },
  {
    id: "equip-6",
    name: "Cooling Fan F4",
    type: "cooling_fan",
    plant_id: "plant-1",
    location: "Cooling Tower A",
    status: "operational",
    health_score: 91,
    install_date: "2022-04-12",
    last_maintenance: "2024-10-22",
    next_maintenance: "2025-04-22",
    rul_hours: 8640,
    model_number: "CF-1200",
    manufacturer: "Howden",
    criticality: "medium",
    created_at: "2022-04-12T00:00:00Z",
  },
  {
    id: "equip-7",
    name: "Cement Mill M1",
    type: "cement_mill",
    plant_id: "plant-1",
    location: "Mill Building 1",
    status: "operational",
    health_score: 78,
    install_date: "2019-09-01",
    last_maintenance: "2024-08-30",
    next_maintenance: "2025-02-28",
    rul_hours: 3600,
    model_number: "CM-5000",
    manufacturer: "FLSmidth",
    criticality: "critical",
    created_at: "2019-09-01T00:00:00Z",
  },
  {
    id: "equip-8",
    name: "Compressor CP1",
    type: "compressor",
    plant_id: "plant-2",
    location: "Utility Room",
    status: "operational",
    health_score: 85,
    install_date: "2021-07-15",
    last_maintenance: "2024-12-15",
    next_maintenance: "2025-06-15",
    rul_hours: 5040,
    model_number: "CP-250",
    manufacturer: "Atlas Copco",
    criticality: "medium",
    created_at: "2021-07-15T00:00:00Z",
  },
];

// ============================================================
// CAMERAS
// ============================================================

export const DEMO_CAMERAS: Camera[] = [
  {
    id: "cam-1",
    name: "Main Gate East",
    location: "Main Entrance - East Gate",
    plant_id: "plant-1",
    status: "recording",
    resolution: "4K",
    fps: 30,
    is_ai_enabled: true,
    detection_types: ["person", "vehicle", "license_plate", "ppe_helmet", "ppe_vest"],
    zone_type: "entry",
    is_recording: true,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "cam-2",
    name: "Kiln Area Cam 1",
    location: "Kiln Bay 1 - North",
    plant_id: "plant-1",
    status: "alert",
    resolution: "1080p",
    fps: 25,
    is_ai_enabled: true,
    detection_types: ["person", "ppe_helmet", "ppe_vest", "fire", "smoke", "motion"],
    zone_type: "production",
    is_recording: true,
    last_alert: new Date(Date.now() - 180000).toISOString(),
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "cam-3",
    name: "Storage Yard North",
    location: "Bulk Storage - North Section",
    plant_id: "plant-1",
    status: "recording",
    resolution: "1080p",
    fps: 15,
    is_ai_enabled: true,
    detection_types: ["person", "vehicle", "intrusion", "motion"],
    zone_type: "storage",
    is_recording: true,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "cam-4",
    name: "Server Room",
    location: "IT Infrastructure Room",
    plant_id: "plant-1",
    status: "recording",
    resolution: "4K",
    fps: 30,
    is_ai_enabled: true,
    detection_types: ["person", "face", "intrusion", "motion"],
    zone_type: "restricted",
    is_recording: true,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "cam-5",
    name: "Vehicle Parking",
    location: "Main Parking Lot",
    plant_id: "plant-1",
    status: "online",
    resolution: "1080p",
    fps: 15,
    is_ai_enabled: true,
    detection_types: ["vehicle", "license_plate", "person"],
    zone_type: "parking",
    is_recording: false,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "cam-6",
    name: "Perimeter Fence W",
    location: "West Perimeter Fence",
    plant_id: "plant-1",
    status: "offline",
    resolution: "720p",
    fps: 10,
    is_ai_enabled: false,
    detection_types: ["motion", "intrusion"],
    zone_type: "perimeter",
    is_recording: false,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "cam-7",
    name: "Control Room",
    location: "Main Control Building",
    plant_id: "plant-1",
    status: "recording",
    resolution: "1080p",
    fps: 25,
    is_ai_enabled: true,
    detection_types: ["person", "face"],
    zone_type: "restricted",
    is_recording: true,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "cam-8",
    name: "Mill Zone Cam 2",
    location: "Cement Mill 1 - South",
    plant_id: "plant-1",
    status: "recording",
    resolution: "1080p",
    fps: 25,
    is_ai_enabled: true,
    detection_types: ["person", "ppe_helmet", "ppe_vest", "ppe_gloves", "fire", "smoke"],
    zone_type: "production",
    is_recording: true,
    created_at: "2023-01-01T00:00:00Z",
  },
];

// ============================================================
// ALERTS
// ============================================================

export const DEMO_ALERTS: Alert[] = [
  {
    id: "alert-1",
    title: "PPE Violation Detected",
    description: "Worker detected without safety helmet in Kiln Bay 1",
    severity: "warning",
    source: "surveillance",
    source_id: "cam-2",
    plant_id: "plant-1",
    is_acknowledged: false,
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "alert-2",
    title: "Vibration Anomaly - Crusher C2",
    description: "Primary Crusher C2 showing abnormal vibration levels (12.4 mm/s). Threshold: 8.0 mm/s",
    severity: "critical",
    source: "sensor",
    source_id: "equip-2",
    plant_id: "plant-1",
    is_acknowledged: false,
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: "alert-3",
    title: "Power Turbine Health Critical",
    description: "Power Turbine T1 health score dropped to 38%. Immediate inspection required.",
    severity: "emergency",
    source: "ai",
    source_id: "equip-4",
    plant_id: "plant-3",
    is_acknowledged: true,
    acknowledged_by: "user-2",
    acknowledged_at: new Date(Date.now() - 1800000).toISOString(),
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "alert-4",
    title: "Unauthorized Access Attempt",
    description: "Unidentified person detected in restricted server room area",
    severity: "critical",
    source: "surveillance",
    source_id: "cam-4",
    plant_id: "plant-1",
    is_acknowledged: false,
    created_at: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: "alert-5",
    title: "Temperature Spike - Kiln Motor A1",
    description: "Kiln Motor A1 temperature reached 94°C. Normal range: 60-80°C",
    severity: "warning",
    source: "sensor",
    source_id: "equip-1",
    plant_id: "plant-1",
    is_acknowledged: true,
    acknowledged_by: "user-3",
    acknowledged_at: new Date(Date.now() - 7200000).toISOString(),
    created_at: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: "alert-6",
    title: "Smoke Detected - Kiln Area",
    description: "AI model detected potential smoke in Kiln Bay 2. Confidence: 87%",
    severity: "emergency",
    source: "surveillance",
    source_id: "cam-2",
    plant_id: "plant-1",
    is_acknowledged: false,
    created_at: new Date(Date.now() - 180000).toISOString(),
  },
];

// ============================================================
// INCIDENTS
// ============================================================

export const DEMO_INCIDENTS: Incident[] = [
  {
    id: "inc-1",
    incident_number: "INC-2025-001",
    title: "Crusher C2 Unexpected Downtime",
    description: "Primary Crusher C2 stopped unexpectedly due to bearing failure. Production halted for 4 hours.",
    severity: "critical",
    status: "investigating",
    type: "equipment_failure",
    plant_id: "plant-1",
    location: "Crushing Unit 2",
    reported_by: "user-3",
    reporter_name: "Chidi Nwachukwu",
    assigned_to: "user-3",
    assignee_name: "Chidi Nwachukwu",
    ai_summary:
      "Bearing failure on Primary Crusher C2 caused by accelerated wear detected 72 hours prior. Vibration data showed progressive deterioration. Estimated repair time: 8-12 hours. Recommend inspection of adjacent bearings.",
    evidence_urls: [],
    escalation_level: 2,
    timeline: [
      {
        id: "tl-1",
        incident_id: "inc-1",
        type: "created",
        description: "Incident reported by maintenance engineer after equipment shutdown",
        user_id: "user-3",
        user_name: "Chidi Nwachukwu",
        timestamp: new Date(Date.now() - 14400000).toISOString(),
      },
      {
        id: "tl-2",
        incident_id: "inc-1",
        type: "updated",
        description: "Initial inspection completed. Bearing damage confirmed. Parts ordered.",
        user_id: "user-3",
        user_name: "Chidi Nwachukwu",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
      },
    ],
    created_at: new Date(Date.now() - 14400000).toISOString(),
    updated_at: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: "inc-2",
    incident_number: "INC-2025-002",
    title: "PPE Non-Compliance - Multiple Workers",
    description: "Surveillance AI detected 3 workers in Kiln Bay 1 without proper PPE for over 15 minutes.",
    severity: "warning",
    status: "open",
    type: "safety_violation",
    plant_id: "plant-1",
    location: "Kiln Bay 1",
    reported_by: "user-4",
    reporter_name: "Ibrahim Musa",
    escalation_level: 1,
    timeline: [],
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "inc-3",
    incident_number: "INC-2025-003",
    title: "Power Turbine Critical Failure Risk",
    description: "AI predictive model indicates 89% probability of Power Turbine T1 failure within 48 hours.",
    severity: "emergency",
    status: "investigating",
    type: "equipment_failure",
    plant_id: "plant-3",
    location: "Power House",
    reported_by: "user-1",
    reporter_name: "System AI",
    assigned_to: "user-2",
    assignee_name: "Emeka Okonkwo",
    ai_summary:
      "Multiple sensor anomalies detected on Power Turbine T1 over 72 hours. Thermal expansion patterns, unusual vibration signature, and oil contamination indicators suggest imminent bearing or blade failure. Immediate controlled shutdown recommended.",
    escalation_level: 3,
    timeline: [],
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

// ============================================================
// WORK ORDERS
// ============================================================

export const DEMO_WORK_ORDERS: WorkOrder[] = [
  {
    id: "wo-1",
    wo_number: "WO-2025-0142",
    equipment_id: "equip-2",
    equipment_name: "Primary Crusher C2",
    priority: "critical",
    type: "corrective",
    status: "in_progress",
    title: "Replace Failed Bearing - Crusher C2",
    description:
      "Emergency bearing replacement following unexpected shutdown. Replace main bearing assembly and inspect adjacent components.",
    assigned_to: "user-3",
    assignee_name: "Chidi Nwachukwu",
    estimated_hours: 10,
    actual_hours: 3,
    due_date: new Date(Date.now() + 86400000).toISOString(),
    created_by: "user-2",
    created_at: new Date(Date.now() - 14400000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "wo-2",
    wo_number: "WO-2025-0141",
    equipment_id: "equip-4",
    equipment_name: "Power Turbine T1",
    priority: "critical",
    type: "predictive",
    status: "open",
    title: "Emergency Inspection - Power Turbine T1",
    description: "Predictive AI flagged imminent failure risk. Full inspection and maintenance required before next shift.",
    due_date: new Date(Date.now() + 43200000).toISOString(),
    created_by: "user-1",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "wo-3",
    wo_number: "WO-2025-0140",
    equipment_id: "equip-5",
    equipment_name: "Hydraulic System H2",
    priority: "medium",
    type: "preventive",
    status: "in_progress",
    title: "Scheduled Hydraulic Fluid Change",
    description: "Routine hydraulic fluid change and filter replacement as per 6-month schedule.",
    assigned_to: "user-3",
    assignee_name: "Chidi Nwachukwu",
    estimated_hours: 4,
    due_date: new Date(Date.now() + 172800000).toISOString(),
    created_by: "user-2",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "wo-4",
    wo_number: "WO-2025-0139",
    equipment_id: "equip-1",
    equipment_name: "Kiln Motor A1",
    priority: "high",
    type: "preventive",
    status: "open",
    title: "Quarterly Motor Inspection & Lubrication",
    description: "Quarterly inspection of motor windings, bearings, and alignment. Apply specified lubricants.",
    estimated_hours: 6,
    due_date: new Date(Date.now() + 604800000).toISOString(),
    created_by: "user-2",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "wo-5",
    wo_number: "WO-2025-0138",
    equipment_id: "equip-7",
    equipment_name: "Cement Mill M1",
    priority: "medium",
    type: "preventive",
    status: "completed",
    title: "Ball Charge Inspection & Top-Up",
    description: "Inspect grinding ball charge, add steel balls as needed, check liner wear.",
    assigned_to: "user-3",
    assignee_name: "Chidi Nwachukwu",
    estimated_hours: 8,
    actual_hours: 7.5,
    due_date: new Date(Date.now() - 86400000).toISOString(),
    created_by: "user-2",
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

// ============================================================
// AI INSIGHTS
// ============================================================

export const DEMO_AI_INSIGHTS: AIInsight[] = [
  {
    id: "ins-1",
    type: "maintenance",
    title: "Crusher C2 Failure Predicted",
    description: "Bearing degradation pattern detected. Replace within 48 hours to prevent unplanned downtime.",
    priority: "high",
    action: "Schedule emergency maintenance",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "ins-2",
    type: "safety",
    title: "PPE Compliance Down 12%",
    description: "PPE violation rate increased during night shifts. Kiln area shows highest non-compliance.",
    priority: "high",
    action: "Brief night shift supervisors",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "ins-3",
    type: "efficiency",
    title: "Energy Usage Optimization",
    description: "Shifting cement mill operations to off-peak hours (02:00-06:00) could save ~₦2.4M monthly.",
    priority: "medium",
    action: "Review production schedule",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: "ins-4",
    type: "maintenance",
    title: "Kiln Motor A1 - Thermal Trend",
    description: "Temperature trend analysis shows 3°C/week increase over past month. Normal range may be breached in 3 weeks.",
    priority: "medium",
    action: "Schedule thermal inspection",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "ins-5",
    type: "alert",
    title: "Power Factor Degradation",
    description: "Plant 3 power factor dropped to 0.82. Reactive power compensation needed to avoid utility penalties.",
    priority: "high",
    action: "Engage electrical team",
    timestamp: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: "ins-6",
    type: "efficiency",
    title: "Conveyor Throughput Optimization",
    description: "Conveyor B3 running at 74% capacity. Increasing belt speed by 8% can boost daily output by ~120 tons.",
    priority: "low",
    action: "Review conveyor settings",
    timestamp: new Date(Date.now() - 21600000).toISOString(),
  },
];

// ============================================================
// NOTIFICATIONS
// ============================================================

export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    title: "Critical Alert: Power Turbine",
    message: "Power Turbine T1 requires immediate attention. Health score: 38%",
    type: "alert",
    severity: "emergency",
    is_read: false,
    action_url: "/maintenance",
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "notif-2",
    title: "New Work Order Assigned",
    message: "WO-2025-0142 assigned to you: Replace Failed Bearing - Crusher C2",
    type: "maintenance",
    severity: "critical",
    is_read: false,
    action_url: "/maintenance",
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: "notif-3",
    title: "AI Insight Available",
    message: "New predictive analysis ready for Kiln Motor A1",
    type: "ai",
    severity: "info",
    is_read: true,
    action_url: "/maintenance",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "notif-4",
    title: "Incident Report Updated",
    message: "INC-2025-001 status changed to Investigating",
    type: "incident",
    severity: "warning",
    is_read: true,
    action_url: "/incidents",
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "notif-5",
    title: "System Maintenance",
    message: "Scheduled system maintenance at 02:00 WAT. Duration: 30 minutes.",
    type: "system",
    severity: "info",
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

// ============================================================
// SENSOR DATA GENERATOR
// ============================================================

export function generateSensorData(equipmentId: string, hours: number = 24): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = Date.now();
  const interval = (hours * 3600000) / 100;

  const baseValues: Record<string, { temp: number; pressure: number; vibration: number; rpm: number; current: number }> = {
    "equip-1": { temp: 78, pressure: 4.2, vibration: 3.1, rpm: 1480, current: 245 },
    "equip-2": { temp: 65, pressure: 6.8, vibration: 8.9, rpm: 1200, current: 180 },
    "equip-3": { temp: 42, pressure: 2.1, vibration: 1.8, rpm: 850, current: 95 },
    "equip-4": { temp: 520, pressure: 18.5, vibration: 4.2, rpm: 3000, current: 480 },
    "equip-5": { temp: 55, pressure: 185, vibration: 2.4, rpm: 1450, current: 32 },
    "equip-6": { temp: 38, pressure: 1.2, vibration: 1.1, rpm: 960, current: 28 },
    "equip-7": { temp: 72, pressure: 3.8, vibration: 5.2, rpm: 1000, current: 320 },
    "equip-8": { temp: 68, pressure: 8.5, vibration: 2.8, rpm: 2950, current: 42 },
  };

  const base = baseValues[equipmentId] || { temp: 60, pressure: 4, vibration: 3, rpm: 1200, current: 150 };

  for (let i = 0; i < 100; i++) {
    const noise = () => (Math.random() - 0.5) * 0.1;
    const spike = i > 85 && equipmentId === "equip-2" ? 1.4 : 1;

    readings.push({
      id: `${equipmentId}-reading-${i}`,
      equipment_id: equipmentId,
      timestamp: new Date(now - (100 - i) * interval).toISOString(),
      temperature: parseFloat((base.temp * (1 + noise()) * spike).toFixed(1)),
      pressure: parseFloat((base.pressure * (1 + noise())).toFixed(2)),
      vibration: parseFloat((base.vibration * (1 + noise()) * spike).toFixed(2)),
      rpm: Math.round(base.rpm * (1 + noise() * 0.5)),
      current: parseFloat((base.current * (1 + noise())).toFixed(1)),
      anomaly_score: i > 85 && equipmentId === "equip-2" ? 0.7 + Math.random() * 0.3 : Math.random() * 0.2,
      is_anomaly: i > 90 && equipmentId === "equip-2",
    });
  }

  return readings;
}

// ============================================================
// MAINTENANCE HISTORY
// ============================================================

export const DEMO_MAINTENANCE_LOGS: MaintenanceLog[] = [
  {
    id: "mlog-1",
    equipment_id: "equip-7",
    work_order_id: "wo-5",
    type: "preventive",
    status: "completed",
    description: "Ball charge inspection and top-up completed. Added 2.4 tons of 40mm steel balls. Liner wear within acceptable limits.",
    technician_id: "user-3",
    technician_name: "Chidi Nwachukwu",
    started_at: new Date(Date.now() - 100800000).toISOString(),
    completed_at: new Date(Date.now() - 73800000).toISOString(),
    scheduled_at: new Date(Date.now() - 86400000).toISOString(),
    cost: 485000,
    parts_used: ["40mm Steel Balls (2.4T)", "Liner Bolts (x12)"],
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "mlog-2",
    equipment_id: "equip-1",
    type: "preventive",
    status: "completed",
    description: "Quarterly inspection completed. Bearings in good condition. Lubrication applied. Alignment checked - within tolerance.",
    technician_id: "user-3",
    technician_name: "Chidi Nwachukwu",
    started_at: new Date(Date.now() - 5270400000).toISOString(),
    completed_at: new Date(Date.now() - 5248800000).toISOString(),
    scheduled_at: new Date(Date.now() - 5270400000).toISOString(),
    cost: 125000,
    parts_used: ["High-Temperature Grease 5kg", "Oil Seal (x2)"],
    created_at: new Date(Date.now() - 5356800000).toISOString(),
  },
];

// ============================================================
// PRODUCTION METRICS GENERATOR
// ============================================================

export function generateProductionMetrics(days: number = 30) {
  const data = [];
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 86400000);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      efficiency: 75 + Math.random() * 20,
      output: 8500 + Math.random() * 3000,
      energy: 12000 + Math.random() * 4000,
      downtime: Math.random() * 4,
    });
  }
  return data;
}

export function generateEnergyData(hours: number = 24) {
  const data = [];
  for (let i = hours; i >= 0; i--) {
    const hour = new Date(Date.now() - i * 3600000);
    data.push({
      time: hour.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      consumption: 850 + Math.sin((i / 24) * Math.PI) * 200 + Math.random() * 100,
      target: 1000,
    });
  }
  return data;
}
