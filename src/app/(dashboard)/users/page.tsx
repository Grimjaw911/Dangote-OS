"use client";

import { useState } from "react";
import {
  Users, Plus, Search, Shield, CheckCircle2, XCircle,
  Settings, Edit, Trash2, Activity, Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KPICard } from "@/components/dashboard/KPICard";
import { DEMO_USERS, DEMO_PLANTS } from "@/data/demo";
import { timeAgo, getInitials } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-500/10 text-red-400 border-red-500/20",
  plant_manager: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  maintenance_engineer: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  security_officer: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  operator: "bg-green-500/10 text-green-400 border-green-500/20",
  auditor: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const PERMISSIONS: Record<string, string[]> = {
  admin: ["Full system access", "User management", "All modules", "Configuration", "Audit logs"],
  plant_manager: ["Command center", "All reports", "Approve work orders", "Manage operators", "View audit logs"],
  maintenance_engineer: ["Maintenance module", "Work orders", "Equipment data", "Sensor data", "Maintenance reports"],
  security_officer: ["Surveillance center", "Incident management", "Security alerts", "Access logs", "Camera control"],
  operator: ["View dashboards", "Create incidents", "View work orders", "Real-time data"],
  auditor: ["Read-only access", "All reports", "Audit logs", "Compliance data"],
};

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const filtered = DEMO_USERS.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = DEMO_USERS.filter((u) => u.is_active).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User & Access Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Role-based access control & user administration
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Invite User
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard title="Total Users" value={DEMO_USERS.length} icon={Users} iconColor="text-blue-400" status="neutral" index={0} />
        <KPICard title="Active Now" value={activeCount} icon={Activity} iconColor="text-emerald-400" status="good" index={1} />
        <KPICard title="Roles" value={6} icon={Shield} iconColor="text-purple-400" status="neutral" index={2} />
        <KPICard title="Plants" value={DEMO_PLANTS.length} icon={CheckCircle2} iconColor="text-cyan-400" status="neutral" index={3} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* User list */}
        <div className="xl:col-span-2 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-9 h-9 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="space-y-2">
            {filtered.map((user) => {
              const plant = DEMO_PLANTS.find((p) => p.id === user.plant_id);
              return (
                <div key={user.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-sm text-primary flex-shrink-0">
                    {getInitials(user.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{user.full_name}</p>
                      <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", user.is_active ? "bg-emerald-400" : "bg-muted-foreground")} />
                    </div>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={cn("text-[10px] px-2 py-0.5 rounded border capitalize", ROLE_COLORS[user.role])}>
                        {user.role.replace(/_/g, " ")}
                      </span>
                      {plant && (
                        <span className="text-[10px] text-muted-foreground">{plant.name}</span>
                      )}
                      {user.last_seen && (
                        <span className="text-[10px] text-muted-foreground">
                          Active {timeAgo(user.last_seen)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roles & Permissions */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Roles & Permissions</p>
          {Object.entries(PERMISSIONS).map(([role, perms]) => (
            <Card key={role}>
              <CardContent className="pt-3 pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("text-xs px-2 py-0.5 rounded border capitalize font-medium", ROLE_COLORS[role])}>
                    {role.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {DEMO_USERS.filter((u) => u.role === role).length} users
                  </span>
                </div>
                <div className="space-y-1">
                  {perms.map((perm) => (
                    <div key={perm} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      {perm}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
