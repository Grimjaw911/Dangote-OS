import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["admin", "plant_manager", "maintenance_engineer", "security_officer", "operator", "auditor"]),
  plant_id: z.string().optional(),
});

export const incidentSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  severity: z.enum(["info", "warning", "critical", "emergency"]),
  type: z.enum(["equipment_failure", "safety_violation", "security_breach", "environmental", "process"]),
  location: z.string().min(3, "Location required"),
  plant_id: z.string(),
});

export const workOrderSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  equipment_id: z.string(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  type: z.enum(["preventive", "corrective", "predictive", "emergency"]),
  due_date: z.string(),
  estimated_hours: z.number().min(0.5).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type IncidentInput = z.infer<typeof incidentSchema>;
export type WorkOrderInput = z.infer<typeof workOrderSchema>;
