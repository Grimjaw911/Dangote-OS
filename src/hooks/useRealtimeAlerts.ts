"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAlertsStore, useNotificationsStore } from "@/store";
import type { Alert, Notification } from "@/types";

export function useRealtimeAlerts() {
  const { addAlert } = useAlertsStore();
  const { addNotification } = useNotificationsStore();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("realtime:alerts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alerts" },
        (payload) => {
          const alert = payload.new as Alert;
          addAlert(alert);
          addNotification({
            id: `notif-${Date.now()}`,
            title: `New ${alert.severity.toUpperCase()} Alert`,
            message: alert.title,
            type: "alert",
            severity: alert.severity,
            is_read: false,
            created_at: new Date().toISOString(),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addAlert, addNotification]);
}

export function useRealtimeSensors(equipmentId: string, onData: (data: unknown) => void) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`realtime:sensors:${equipmentId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sensor_data",
          filter: `equipment_id=eq.${equipmentId}`,
        },
        (payload) => {
          onData(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [equipmentId, onData]);
}
