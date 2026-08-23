"use client";

import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

interface AnalyticsChartProps {
  deployedCapital?: number; // in XLM
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

function buildData(deployedCapital: number) {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed
  return MONTHS.slice(0, currentMonth + 1).map((month, i) => {
    const growthFactor = 1 + i * 0.08;
    const interest = i === 0 ? 0 : parseFloat((deployedCapital * 0.05 * i * growthFactor).toFixed(4));
    const deployed = parseFloat((deployedCapital * (1 + i * 0.03)).toFixed(2));
    return { month, interest, deployed };
  });
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; fill: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(15,15,30,0.95)",
      border: "1px solid rgba(126,47,208,0.3)",
      borderRadius: "0.75rem",
      padding: "0.75rem 1rem",
      fontSize: "0.82rem",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      backdropFilter: "blur(8px)",
      minWidth: "160px",
    }}>
      <p style={{ fontWeight: 700, marginBottom: "0.5rem", color: "#e5e7eb" }}>{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "0.25rem" }}>
          <span style={{ color: entry.color || entry.fill, fontWeight: 600 }}>{entry.name}</span>
          <span style={{ color: "#f3f4f6", fontWeight: 700 }}>{entry.value.toFixed(4)} XLM</span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsChart({ deployedCapital = 0 }: AnalyticsChartProps) {
  const data = buildData(deployedCapital);
  const hasData = data.some((d) => d.interest > 0 || d.deployed > 0);

  return (
    <article
      className="workspace-card workspace-card--full"
      style={{ marginBottom: "1.5rem", padding: "1.5rem" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <h2 className="workspace-card-title" style={{ margin: 0 }}>Portfolio Growth Analytics</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem", opacity: 0.7 }}>
            Cumulative interest earned &amp; capital deployed over time
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            { label: "Capital Deployed", value: `${deployedCapital.toFixed(2)} XLM`, color: "#7e2fd0" },
            { label: "Interest Earned", value: `${data[data.length - 1]?.interest?.toFixed(4) ?? "0.0000"} XLM`, color: "#22cf9d" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.15rem" }}>
                {stat.label}
              </p>
              <p style={{ fontSize: "0.9rem", fontWeight: 800, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div style={{ height: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📊</p>
          <p style={{ fontSize: "0.85rem" }}>Chart will populate as you deploy capital and earn interest</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22cf9d" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22cf9d" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="deployedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7e2fd0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7e2fd0" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "rgba(255,255,255,0.45)" }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.45)" }}
              axisLine={false}
              tickLine={false}
              width={48}
              tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(126,47,208,0.3)", strokeWidth: 1 }} />
            <Legend
              wrapperStyle={{ fontSize: "0.78rem", paddingTop: "1rem", color: "rgba(255,255,255,0.6)" }}
              iconType="circle"
              iconSize={8}
            />

            {data.length > 1 && (
              <ReferenceLine
                x={data[data.length - 1]?.month}
                stroke="rgba(255,255,255,0.12)"
                strokeDasharray="4 2"
                label={{ value: "Now", position: "top", fontSize: 10, fill: "rgba(255,255,255,0.35)" }}
              />
            )}

            {/* Deployed capital as bars */}
            <Bar
              dataKey="deployed"
              name="Capital Deployed"
              fill="#7e2fd0"
              fillOpacity={0.5}
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />

            {/* Interest earned as smooth area */}
            <Area
              type="monotone"
              dataKey="interest"
              name="Interest Earned"
              stroke="#22cf9d"
              strokeWidth={2.5}
              fill="url(#interestGradient)"
              dot={{ r: 3, fill: "#22cf9d", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#22cf9d", stroke: "rgba(34,207,157,0.4)", strokeWidth: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </article>
  );
}
