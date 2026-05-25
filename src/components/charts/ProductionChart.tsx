"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";

interface BarChartProps {
  data: Array<Record<string, string | number>>;
  bars: Array<{ dataKey: string; color: string; name: string }>;
  xKey?: string;
  height?: number;
}

export function ProductionBarChart({ data, bars, xKey = "name", height = 200 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
        />
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "11px",
          }}
        />
        {bars.map((b) => (
          <Bar key={b.dataKey} dataKey={b.dataKey} name={b.name} fill={b.color} radius={[3, 3, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

interface DonutChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  height?: number;
  label?: string;
  labelValue?: string;
}

export function DonutChart({ data, height = 160, label, labelValue }: DonutChartProps) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={height * 0.28}
            outerRadius={height * 0.4}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "11px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {label && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold">{labelValue}</span>
          <span className="text-[10px] text-muted-foreground">{label}</span>
        </div>
      )}
    </div>
  );
}

interface GaugeProps {
  value: number;
  max?: number;
  color?: string;
  size?: number;
}

export function GaugeChart({ value, max = 100, color = "#0ea5e9", size = 120 }: GaugeProps) {
  const data = [
    { name: "value", value: value, fill: color },
    { name: "empty", value: max - value, fill: "hsl(var(--border))" },
  ];

  return (
    <ResponsiveContainer width={size} height={size / 1.5}>
      <RadialBarChart
        cx="50%"
        cy="80%"
        innerRadius="60%"
        outerRadius="90%"
        startAngle={180}
        endAngle={0}
        data={data}
      >
        <RadialBar dataKey="value" cornerRadius={4} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

interface AreaChartProps {
  data: Array<Record<string, string | number>>;
  xKey?: string;
  areas: Array<{ dataKey: string; color: string; name: string }>;
  height?: number;
}

export function MultiAreaChart({ data, xKey = "time", areas, height = 200 }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          {areas.map((a) => (
            <linearGradient key={a.dataKey} id={`grad-${a.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={a.color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={a.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
        />
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "11px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "11px" }} iconType="line" iconSize={12} />
        {areas.map((a) => (
          <Area
            key={a.dataKey}
            type="monotone"
            dataKey={a.dataKey}
            name={a.name}
            stroke={a.color}
            strokeWidth={1.5}
            fill={`url(#grad-${a.dataKey})`}
            dot={false}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
