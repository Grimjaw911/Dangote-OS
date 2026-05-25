-- ============================================================
-- DANGOTE PREDICTIVE MAINTENANCE & SURVEILLANCE OS
-- Supabase PostgreSQL Schema
-- Project: tzbvtwdfrsodcrcgeuvp
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "timescaledb" CASCADE; -- for time-series if available

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'admin', 'plant_manager', 'maintenance_engineer',
  'security_officer', 'operator', 'auditor'
);

CREATE TYPE plant_type AS ENUM ('cement', 'manufacturing', 'logistics', 'power');
CREATE TYPE plant_status AS ENUM ('operational', 'maintenance', 'offline');
CREATE TYPE equipment_status AS ENUM ('operational', 'warning', 'critical', 'offline', 'maintenance');
CREATE TYPE equipment_type AS ENUM (
  'kiln_motor', 'crusher', 'conveyor', 'power_turbine',
  'hydraulic_system', 'cooling_fan', 'cement_mill', 'compressor', 'pump', 'generator'
);
CREATE TYPE criticality_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE camera_status AS ENUM ('online', 'offline', 'recording', 'alert');
CREATE TYPE zone_type AS ENUM ('entry', 'production', 'storage', 'restricted', 'parking', 'perimeter');
CREATE TYPE detection_type AS ENUM (
  'person', 'vehicle', 'ppe_helmet', 'ppe_vest', 'ppe_gloves', 'ppe_boots',
  'fire', 'smoke', 'intrusion', 'motion', 'license_plate', 'face'
);
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical', 'emergency');
CREATE TYPE alert_source AS ENUM ('surveillance', 'maintenance', 'sensor', 'manual', 'ai');
CREATE TYPE incident_status AS ENUM ('open', 'investigating', 'resolved', 'closed');
CREATE TYPE incident_type AS ENUM (
  'equipment_failure', 'safety_violation', 'security_breach', 'environmental', 'process'
);
CREATE TYPE maintenance_type AS ENUM ('preventive', 'corrective', 'predictive', 'emergency');
CREATE TYPE work_order_status AS ENUM ('open', 'assigned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE work_order_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE report_type AS ENUM (
  'daily', 'weekly', 'monthly', 'custom', 'incident', 'maintenance', 'safety'
);

-- ============================================================
-- PLANTS
-- ============================================================

CREATE TABLE plants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  type plant_type NOT NULL,
  status plant_status DEFAULT 'operational',
  efficiency NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'operator',
  plant_id UUID REFERENCES plants(id),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EQUIPMENT
-- ============================================================

CREATE TABLE equipment (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type equipment_type NOT NULL,
  location TEXT NOT NULL,
  status equipment_status DEFAULT 'operational',
  health_score NUMERIC(5,2) DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100),
  install_date DATE NOT NULL,
  last_maintenance DATE,
  next_maintenance DATE,
  rul_hours INTEGER DEFAULT 0,
  model_number TEXT,
  manufacturer TEXT,
  criticality criticality_level DEFAULT 'medium',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SENSOR DATA (time-series)
-- ============================================================

CREATE TABLE sensor_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  temperature NUMERIC(8,2),
  pressure NUMERIC(8,2),
  vibration NUMERIC(8,2),
  rpm NUMERIC(8,2),
  current NUMERIC(8,2),
  voltage NUMERIC(8,2),
  oil_level NUMERIC(5,2),
  noise_level NUMERIC(8,2),
  anomaly_score NUMERIC(5,4) DEFAULT 0 CHECK (anomaly_score BETWEEN 0 AND 1),
  is_anomaly BOOLEAN DEFAULT FALSE,
  raw_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partition by time for performance (if TimescaleDB not available, use regular indexes)
CREATE INDEX idx_sensor_data_equipment_time ON sensor_data(equipment_id, timestamp DESC);
CREATE INDEX idx_sensor_data_anomaly ON sensor_data(is_anomaly) WHERE is_anomaly = TRUE;
CREATE INDEX idx_sensor_data_timestamp ON sensor_data(timestamp DESC);

-- ============================================================
-- CAMERAS
-- ============================================================

CREATE TABLE cameras (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  status camera_status DEFAULT 'online',
  stream_url TEXT,
  resolution TEXT DEFAULT '1080p',
  fps INTEGER DEFAULT 25,
  is_ai_enabled BOOLEAN DEFAULT TRUE,
  detection_types detection_type[] DEFAULT '{}',
  zone_type zone_type DEFAULT 'production',
  is_recording BOOLEAN DEFAULT FALSE,
  last_alert TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AI DETECTIONS
-- ============================================================

CREATE TABLE ai_detections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  camera_id UUID REFERENCES cameras(id) ON DELETE CASCADE NOT NULL,
  type detection_type NOT NULL,
  confidence NUMERIC(5,4) NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  bbox JSONB, -- {x, y, width, height}
  frame_url TEXT,
  is_alert BOOLEAN DEFAULT FALSE,
  alert_id UUID, -- references alerts if alert was created
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_detections_camera ON ai_detections(camera_id, timestamp DESC);
CREATE INDEX idx_ai_detections_type ON ai_detections(type);
CREATE INDEX idx_ai_detections_alert ON ai_detections(is_alert) WHERE is_alert = TRUE;

-- ============================================================
-- ALERTS
-- ============================================================

CREATE TABLE alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity alert_severity DEFAULT 'info',
  source alert_source DEFAULT 'manual',
  source_id UUID, -- id of camera/equipment/sensor that triggered alert
  is_acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID REFERENCES profiles(id),
  acknowledged_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_plant ON alerts(plant_id, created_at DESC);
CREATE INDEX idx_alerts_unacked ON alerts(is_acknowledged) WHERE is_acknowledged = FALSE;
CREATE INDEX idx_alerts_severity ON alerts(severity, created_at DESC);

-- ============================================================
-- INCIDENTS
-- ============================================================

CREATE TABLE incidents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE NOT NULL,
  incident_number TEXT UNIQUE NOT NULL DEFAULT 'INC-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(CAST(FLOOR(RANDOM() * 9999) AS TEXT), 4, '0'),
  title TEXT NOT NULL,
  description TEXT,
  severity alert_severity DEFAULT 'info',
  status incident_status DEFAULT 'open',
  type incident_type NOT NULL,
  location TEXT NOT NULL,
  reported_by UUID REFERENCES profiles(id),
  assigned_to UUID REFERENCES profiles(id),
  ai_summary TEXT,
  evidence_urls TEXT[] DEFAULT '{}',
  escalation_level INTEGER DEFAULT 1 CHECK (escalation_level BETWEEN 1 AND 5),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE incident_timeline (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id),
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_incidents_plant ON incidents(plant_id, created_at DESC);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_severity ON incidents(severity, created_at DESC);

-- ============================================================
-- WORK ORDERS
-- ============================================================

CREATE TABLE work_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wo_number TEXT UNIQUE NOT NULL DEFAULT 'WO-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(CAST(FLOOR(RANDOM() * 9999) AS TEXT), 4, '0'),
  equipment_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
  plant_id UUID REFERENCES plants(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority work_order_priority DEFAULT 'medium',
  type maintenance_type DEFAULT 'preventive',
  status work_order_status DEFAULT 'open',
  assigned_to UUID REFERENCES profiles(id),
  estimated_hours NUMERIC(6,2),
  actual_hours NUMERIC(6,2),
  due_date TIMESTAMPTZ NOT NULL,
  cost NUMERIC(12,2),
  parts_used TEXT[] DEFAULT '{}',
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_work_orders_equipment ON work_orders(equipment_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_orders_due ON work_orders(due_date) WHERE status NOT IN ('completed', 'cancelled');

-- ============================================================
-- MAINTENANCE LOGS
-- ============================================================

CREATE TABLE maintenance_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE NOT NULL,
  work_order_id UUID REFERENCES work_orders(id) ON DELETE SET NULL,
  type maintenance_type NOT NULL,
  status TEXT DEFAULT 'completed',
  description TEXT NOT NULL,
  technician_id UUID REFERENCES profiles(id),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ NOT NULL,
  cost NUMERIC(12,2),
  parts_used TEXT[] DEFAULT '{}',
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_maintenance_logs_equipment ON maintenance_logs(equipment_id, scheduled_at DESC);

-- ============================================================
-- REPORTS
-- ============================================================

CREATE TABLE reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plant_id UUID REFERENCES plants(id),
  title TEXT NOT NULL,
  type report_type NOT NULL,
  status TEXT DEFAULT 'generating',
  generated_by UUID REFERENCES profiles(id),
  date_range_start TIMESTAMPTZ,
  date_range_end TIMESTAMPTZ,
  file_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_time ON audit_logs(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read most data
CREATE POLICY "Authenticated users can view plants" ON plants FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated users can view equipment" ON equipment FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated users can view sensors" ON sensor_data FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated users can view cameras" ON cameras FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated users can view detections" ON ai_detections FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated users can view alerts" ON alerts FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated users can view incidents" ON incidents FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated users can view work orders" ON work_orders FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated users can view maintenance logs" ON maintenance_logs FOR SELECT TO authenticated USING (TRUE);

-- Profiles - users can view all, edit own
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Admin can do everything (using a helper function)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Admins can insert plants" ON plants FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update plants" ON plants FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admins can insert equipment" ON equipment FOR INSERT TO authenticated WITH CHECK (is_admin() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'plant_manager', 'maintenance_engineer')));
CREATE POLICY "Admins can update equipment" ON equipment FOR UPDATE TO authenticated USING (is_admin() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'plant_manager', 'maintenance_engineer')));

-- Incidents - any authenticated user can create, assigned/admin can update
CREATE POLICY "Users can create incidents" ON incidents FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Users can update assigned incidents" ON incidents FOR UPDATE TO authenticated
  USING (reported_by = auth.uid() OR assigned_to = auth.uid() OR is_admin());

-- Work orders
CREATE POLICY "Engineers can create work orders" ON work_orders FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'plant_manager', 'maintenance_engineer')));

-- Alerts
CREATE POLICY "Users can create alerts" ON alerts FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Users can update own alerts" ON alerts FOR UPDATE TO authenticated USING (TRUE);

-- ============================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================

-- Enable realtime for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE sensor_data;
ALTER PUBLICATION supabase_realtime ADD TABLE ai_detections;
ALTER PUBLICATION supabase_realtime ADD TABLE work_orders;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_plants_updated_at BEFORE UPDATE ON plants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_cameras_updated_at BEFORE UPDATE ON cameras FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'operator')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- SEED DEMO DATA
-- ============================================================

INSERT INTO plants (id, name, location, type, status, efficiency) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Dangote Cement - Obajana', 'Kogi State, Nigeria', 'cement', 'operational', 87),
  ('22222222-2222-2222-2222-222222222222', 'Dangote Industries - Lagos', 'Lagos, Nigeria', 'manufacturing', 'operational', 92),
  ('33333333-3333-3333-3333-333333333333', 'Dangote Power - Abuja', 'FCT, Nigeria', 'power', 'maintenance', 73);

INSERT INTO equipment (plant_id, name, type, location, status, health_score, install_date, last_maintenance, next_maintenance, rul_hours, model_number, manufacturer, criticality) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Kiln Motor A1', 'kiln_motor', 'Kiln Bay 1', 'operational', 87, '2020-03-15', '2024-11-20', '2025-02-20', 4320, 'KM-2400-XL', 'Siemens', 'critical'),
  ('11111111-1111-1111-1111-111111111111', 'Primary Crusher C2', 'crusher', 'Crushing Unit 2', 'warning', 62, '2019-06-10', '2024-09-05', '2025-01-05', 1440, 'CR-1800', 'Metso', 'high'),
  ('11111111-1111-1111-1111-111111111111', 'Conveyor Belt B3', 'conveyor', 'Transfer Station 3', 'operational', 94, '2021-01-20', '2024-12-01', '2025-03-01', 7200, 'CB-600', 'ABB', 'medium'),
  ('33333333-3333-3333-3333-333333333333', 'Power Turbine T1', 'power_turbine', 'Power House', 'critical', 38, '2018-08-01', '2024-07-15', '2025-01-15', 480, 'PT-GE-9E', 'GE', 'critical'),
  ('11111111-1111-1111-1111-111111111111', 'Hydraulic System H2', 'hydraulic_system', 'Hydraulics Bay', 'maintenance', 55, '2020-11-30', '2025-01-10', '2025-04-10', 2880, 'HYD-400', 'Parker', 'high'),
  ('11111111-1111-1111-1111-111111111111', 'Cooling Fan F4', 'cooling_fan', 'Cooling Tower A', 'operational', 91, '2022-04-12', '2024-10-22', '2025-04-22', 8640, 'CF-1200', 'Howden', 'medium'),
  ('11111111-1111-1111-1111-111111111111', 'Cement Mill M1', 'cement_mill', 'Mill Building 1', 'operational', 78, '2019-09-01', '2024-08-30', '2025-02-28', 3600, 'CM-5000', 'FLSmidth', 'critical');

INSERT INTO cameras (plant_id, name, location, status, resolution, fps, is_ai_enabled, detection_types, zone_type, is_recording) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Main Gate East', 'Main Entrance - East Gate', 'recording', '4K', 30, TRUE, ARRAY['person','vehicle','license_plate','ppe_helmet','ppe_vest']::detection_type[], 'entry', TRUE),
  ('11111111-1111-1111-1111-111111111111', 'Kiln Area Cam 1', 'Kiln Bay 1 - North', 'alert', '1080p', 25, TRUE, ARRAY['person','ppe_helmet','ppe_vest','fire','smoke','motion']::detection_type[], 'production', TRUE),
  ('11111111-1111-1111-1111-111111111111', 'Storage Yard North', 'Bulk Storage - North Section', 'recording', '1080p', 15, TRUE, ARRAY['person','vehicle','intrusion','motion']::detection_type[], 'storage', TRUE),
  ('11111111-1111-1111-1111-111111111111', 'Server Room', 'IT Infrastructure Room', 'recording', '4K', 30, TRUE, ARRAY['person','face','intrusion','motion']::detection_type[], 'restricted', TRUE),
  ('11111111-1111-1111-1111-111111111111', 'Vehicle Parking', 'Main Parking Lot', 'online', '1080p', 15, TRUE, ARRAY['vehicle','license_plate','person']::detection_type[], 'parking', FALSE),
  ('11111111-1111-1111-1111-111111111111', 'Perimeter Fence W', 'West Perimeter Fence', 'offline', '720p', 10, FALSE, ARRAY['motion','intrusion']::detection_type[], 'perimeter', FALSE);
