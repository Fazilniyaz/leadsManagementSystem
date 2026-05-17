import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 186000, target: 180000 },
  { month: "Feb", revenue: 205000, target: 190000 },
  { month: "Mar", revenue: 237000, target: 200000 },
  { month: "Apr", revenue: 273000, target: 220000 },
  { month: "May", revenue: 209000, target: 230000 },
  { month: "Jun", revenue: 314000, target: 250000 },
  { month: "Jul", revenue: 352000, target: 270000 },
  { month: "Aug", revenue: 389000, target: 290000 },
  { month: "Sep", revenue: 421000, target: 310000 },
  { month: "Oct", revenue: 458000, target: 330000 },
  { month: "Nov", revenue: 492000, target: 350000 },
  { month: "Dec", revenue: 547000, target: 380000 },
];

export function RevenueChart() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ background: '#1a1d23', border: '1px solid #2a2d35', borderRadius: 12, padding: 20, height: 380, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f0ede6', margin: 0 }}>Revenue Trend</h3>
          <p style={{ fontSize: 14, color: '#9ca3af', margin: '4px 0 0' }}>Monthly performance vs target</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6' }} />
            <span style={{ color: '#9ca3af' }}>Revenue</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ade80' }} />
            <span style={{ color: '#9ca3af' }}>Target</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, opacity: isLoaded ? 1 : 0, transition: 'opacity 0.7s', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2d35" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1d23",
                border: "1px solid #2a2d35",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#f0ede6"
              }}
              labelStyle={{ color: "#f0ede6", fontWeight: 600 }}
              itemStyle={{ color: "#9ca3af" }}
              formatter={(value) => {
                const numericValue = typeof value === "number" ? value : Number(value) || 0;
                return [`$${(numericValue / 1000).toFixed(0)}k`, "Revenue"];
              }}
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="#4ade80"
              strokeWidth={2}
              fill="url(#targetGradient)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
