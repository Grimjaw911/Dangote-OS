// ============================================================
// DANGOTE OS - Global State (Zustand)
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User,
  Alert,
  Notification,
  AIInsight,
  DashboardStats,
  ChatMessage,
} from "@/types";
import {
  DEMO_ALERTS,
  DEMO_NOTIFICATIONS,
  DEMO_AI_INSIGHTS,
} from "@/data/demo";

// ============================================================
// AUTH STORE
// ============================================================

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "dangote-auth" }
  )
);

// ============================================================
// UI STORE
// ============================================================

interface UIStore {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: "dark" | "light" | "system";
  commandPaletteOpen: boolean;
  aiChatOpen: boolean;
  selectedPlant: string;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: "dark" | "light" | "system") => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setAiChatOpen: (open: boolean) => void;
  setSelectedPlant: (plant: string) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      theme: "dark",
      commandPaletteOpen: false,
      aiChatOpen: false,
      selectedPlant: "plant-1",
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setTheme: (theme) => set({ theme }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setAiChatOpen: (open) => set({ aiChatOpen: open }),
      setSelectedPlant: (plant) => set({ selectedPlant: plant }),
    }),
    { name: "dangote-ui" }
  )
);

// ============================================================
// ALERTS STORE
// ============================================================

interface AlertsStore {
  alerts: Alert[];
  unreadCount: number;
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (id: string, userId: string) => void;
  setAlerts: (alerts: Alert[]) => void;
}

export const useAlertsStore = create<AlertsStore>((set) => ({
  alerts: DEMO_ALERTS,
  unreadCount: DEMO_ALERTS.filter((a) => !a.is_acknowledged).length,
  addAlert: (alert) =>
    set((s) => ({
      alerts: [alert, ...s.alerts],
      unreadCount: s.unreadCount + 1,
    })),
  acknowledgeAlert: (id, userId) =>
    set((s) => {
      const alerts = s.alerts.map((a) =>
        a.id === id
          ? { ...a, is_acknowledged: true, acknowledged_by: userId, acknowledged_at: new Date().toISOString() }
          : a
      );
      return { alerts, unreadCount: alerts.filter((a) => !a.is_acknowledged).length };
    }),
  setAlerts: (alerts) =>
    set({ alerts, unreadCount: alerts.filter((a) => !a.is_acknowledged).length }),
}));

// ============================================================
// NOTIFICATIONS STORE
// ============================================================

interface NotificationsStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearNotification: (id: string) => void;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  notifications: DEMO_NOTIFICATIONS,
  unreadCount: DEMO_NOTIFICATIONS.filter((n) => !n.is_read).length,
  addNotification: (n) =>
    set((s) => ({
      notifications: [n, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    })),
  markRead: (id) =>
    set((s) => {
      const notifications = s.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.is_read).length };
    }),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    })),
  clearNotification: (id) =>
    set((s) => {
      const notifications = s.notifications.filter((n) => n.id !== id);
      return { notifications, unreadCount: notifications.filter((n) => !n.is_read).length };
    }),
}));

// ============================================================
// AI INSIGHTS STORE
// ============================================================

interface AIInsightsStore {
  insights: AIInsight[];
  isLoading: boolean;
  setInsights: (insights: AIInsight[]) => void;
  addInsight: (insight: AIInsight) => void;
}

export const useAIInsightsStore = create<AIInsightsStore>((set) => ({
  insights: DEMO_AI_INSIGHTS,
  isLoading: false,
  setInsights: (insights) => set({ insights }),
  addInsight: (insight) =>
    set((s) => ({ insights: [insight, ...s.insights] })),
}));

// ============================================================
// DASHBOARD STORE
// ============================================================

interface DashboardStore {
  stats: DashboardStats;
  lastUpdated: string;
  updateStats: (stats: Partial<DashboardStats>) => void;
}

const defaultStats: DashboardStats = {
  active_cameras: 7,
  active_alerts: 4,
  security_risk_score: 68,
  workers_detected: 23,
  ppe_compliance: 76,
  equipment_health_avg: 74,
  critical_equipment: 2,
  open_work_orders: 4,
  production_efficiency: 87,
  energy_consumption: 1240,
  incidents_today: 3,
  uptime_percent: 94.2,
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: defaultStats,
  lastUpdated: new Date().toISOString(),
  updateStats: (stats) =>
    set((s) => ({
      stats: { ...s.stats, ...stats },
      lastUpdated: new Date().toISOString(),
    })),
}));

// ============================================================
// AI CHAT STORE
// ============================================================

interface AIChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

export const useAIChatStore = create<AIChatStore>((set) => ({
  messages: [
    {
      id: "sys-1",
      role: "assistant",
      content:
        "Hello! I'm DangoteAI, your intelligent industrial operations assistant. I can help you analyze equipment health, predict failures, review incidents, and provide operational insights. What would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ],
  isLoading: false,
  addMessage: (message) =>
    set((s) => ({ messages: [...s.messages, message] })),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () =>
    set({
      messages: [
        {
          id: "sys-1",
          role: "assistant",
          content: "Hello! I'm DangoteAI. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ],
    }),
}));
