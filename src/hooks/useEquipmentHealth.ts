"use client";

import { useState, useEffect, useCallback } from "react";
import type { Equipment, SensorReading, AnomalyPrediction } from "@/types";
import { generateSensorData } from "@/data/demo";
import { DEMO_EQUIPMENT } from "@/data/demo";

function computeAnomaly(readings: SensorReading[]): AnomalyPrediction | null {
  if (!readings.length) return null;

  const recent = readings.slice(-10);
  const avgAnomaly = recent.reduce((a, r) => a + r.anomaly_score, 0) / recent.length;
  const maxVibration = Math.max(...recent.map((r) => r.vibration));
  const avgTemp = recent.reduce((a, r) => a + r.temperature, 0) / recent.length;

  const equipment = DEMO_EQUIPMENT[0]; // simplified
  const failureProbability = Math.min(0.99, avgAnomaly * 1.2 + (maxVibration > 10 ? 0.3 : 0));

  return {
    equipment_id: readings[0].equipment_id,
    equipment_name: "Equipment",
    anomaly_score: avgAnomaly,
    failure_probability: failureProbability,
    predicted_failure_date:
      failureProbability > 0.7
        ? new Date(Date.now() + 48 * 3600000).toISOString()
        : undefined,
    rul_hours: Math.round(1000 * (1 - failureProbability)),
    recommendation:
      failureProbability > 0.8
        ? "Emergency maintenance required within 24 hours"
        : failureProbability > 0.5
        ? "Schedule maintenance within 72 hours"
        : "Monitor closely — no immediate action required",
    confidence: 0.85 + Math.random() * 0.1,
    features: {
      temperature_anomaly: avgTemp > 90,
      vibration_anomaly: maxVibration > 8,
      pressure_anomaly: false,
      current_anomaly: false,
    },
  };
}

export function useEquipmentHealth(equipmentId: string) {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [prediction, setPrediction] = useState<AnomalyPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(() => {
    const data = generateSensorData(equipmentId, 24);
    setReadings(data);
    setPrediction(computeAnomaly(data));
    setIsLoading(false);
  }, [equipmentId]);

  useEffect(() => {
    setIsLoading(true);
    loadData();

    const interval = setInterval(() => {
      const newPoint = generateSensorData(equipmentId, 0.1);
      setReadings((prev) => {
        const updated = [...prev.slice(-99), ...newPoint];
        setPrediction(computeAnomaly(updated));
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [equipmentId, loadData]);

  return { readings, prediction, isLoading };
}
