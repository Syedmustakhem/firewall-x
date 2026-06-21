import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, TrendingDown, Shield, AlertTriangle } from "lucide-react";
import { Card, StatCard } from "../components/ui";

// WHY TRAFFIC CHARTS?
// A firewall without visibility is useless. You need to see:
// - How much traffic is being blocked vs allowed
// - Which hours have peak traffic (attack patterns often repeat)
// - Which protocols are most used
// This data comes from nftables counters that the agent reports back.
// For now we use simulated data — when your telemetry module is ready,
// replace generateData() with real API calls.

const generateHourlyData = () =>
  Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    allowed: Math.floor(Math.random() * 8000) + 2000,
    blocked: Math.floor(Math.random() * 2000) + 200,
    total: 0,
  })).map((d) => ({ ...d, total: d.allowed + d.blocked }));

const generateWeeklyData = () =>
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
    day,
    allowed: Math.floor(Math.random() * 50000) + 20000,
    blocked: Math.floor(Math.random() * 10000) + 1000,
  }));

const PROTOCOL_DATA = [
  { name: "TCP", value: 58, color: "#3b82f6" },
  { name: "UDP", value: 28, color: "#8b5cf6" },
  { name: "ICMP", value: 9,  color: "#f59e0b" },
  { name: "Other", value: 5, color: "#6b7280" },
];

export const TrafficPage = () => {
  const [hourlyData] = useState(generateHourlyData);
  const [weeklyData] = useState(generateWeeklyData);

  const totalAllowed = hourlyData.reduce((s, d) => s + d.allowed, 0);
  const totalBlocked = hourlyData.reduce((s, d) => s + d.blocked, 0);
  const blockRate = ((totalBlocked / (totalAllowed + totalBlocked)) * 100).toFixed(1);

  const tooltipStyle = {
    backgroundColor: "rgba(17,24,39,0.95)",
    border: "1px solid rgba(75,85,99,0.5)",
    borderRadius: "12px",
    color: "#f9fafb",
    fontSize: "12px",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Network Traffic</h1>
        <p className="page-subtitle">Traffic analytics from all devices — last 24 hours</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Packets Allowed" value={totalAllowed.toLocaleString()} icon={<TrendingUp className="w-5 h-5" />} color="green" subtitle="Today" />
        <StatCard title="Packets Blocked" value={totalBlocked.toLocaleString()} icon={<Shield className="w-5 h-5" />} color="red" subtitle="Today" />
        <StatCard title="Block Rate" value={`${blockRate}%`} icon={<AlertTriangle className="w-5 h-5" />} color="yellow" subtitle="Of total traffic" />
        <StatCard title="Peak Hour" value="14:00" icon={<TrendingDown className="w-5 h-5" />} color="blue" subtitle="Highest traffic" />
      </div>

      {/* Hourly Traffic */}
      <Card>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-6">Hourly Traffic — Today</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={hourlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="allowedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,114,128,0.15)" />
            <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} interval={3} />
            <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="allowed" stroke="#22c55e" strokeWidth={2} fill="url(#allowedGrad)" name="Allowed" />
            <Area type="monotone" dataKey="blocked" stroke="#ef4444" strokeWidth={2} fill="url(#blockedGrad)" name="Blocked" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Bar Chart */}
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-6">Weekly Overview</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,114,128,0.15)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="allowed" fill="#3b82f6" radius={[4,4,0,0]} name="Allowed" />
              <Bar dataKey="blocked" fill="#ef4444" radius={[4,4,0,0]} name="Blocked" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Protocol Pie Chart */}
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-6">Protocol Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={PROTOCOL_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                {PROTOCOL_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, ""]} />
              <Legend formatter={(value) => <span style={{ color: "#6b7280", fontSize: 12 }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};