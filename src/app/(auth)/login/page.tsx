"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Eye, EyeOff, Loader2, Shield, Activity, Camera, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store";
import { DEMO_USERS } from "@/data/demo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: Camera, label: "AI Surveillance", desc: "Real-time camera monitoring & detection" },
  { icon: Wrench, label: "Predictive Maintenance", desc: "AI-powered failure prediction" },
  { icon: Shield, label: "Incident Management", desc: "Track and resolve operational issues" },
  { icon: Activity, label: "Live Analytics", desc: "Real-time operational dashboards" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("admin@dangote.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    // Demo: find user by email
    const user = DEMO_USERS.find((u) => u.email === email);
    if (user) {
      setUser(user);
      toast.success(`Welcome back, ${user.full_name}!`);
      router.push("/");
    } else {
      toast.error("Invalid credentials. Try admin@dangote.com / admin123");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background cyber-grid">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-sidebar border-r border-sidebar-border">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold text-sidebar-foreground">DANGOTE OS</p>
              <p className="text-xs text-muted-foreground">Industrial Operations Platform</p>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-sidebar-foreground leading-tight mb-4">
            Industrial AI<br />
            <span className="text-primary">Operations Center</span>
          </h1>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            Enterprise-grade predictive maintenance and AI surveillance for cement plants,
            manufacturing facilities, and power generation sites.
          </p>
        </div>

        <div className="space-y-4">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-sidebar-accent border border-sidebar-border"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          © 2025 Dangote Industries Limited. All rights reserved.
        </p>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold">DANGOTE OS</p>
              <p className="text-xs text-muted-foreground">Industrial Platform</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">Sign in</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Access your industrial operations dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-sm">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1.5 h-10"
                required
              />
            </div>
            <div>
              <Label className="text-sm">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-10" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Demo Credentials</p>
            <div className="space-y-1.5">
              {[
                { email: "admin@dangote.com", role: "Admin" },
                { email: "engineer@dangote.com", role: "Maintenance Engineer" },
                { email: "security@dangote.com", role: "Security Officer" },
              ].map((cred) => (
                <button
                  key={cred.email}
                  onClick={() => { setEmail(cred.email); setPassword("admin123"); }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <span className="text-xs font-mono text-muted-foreground">{cred.email}</span>
                  <span className="text-[10px] text-primary">{cred.role}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">Password: admin123 (for all demo users)</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
