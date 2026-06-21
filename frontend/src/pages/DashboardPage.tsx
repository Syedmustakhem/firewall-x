import { useEffect, useState } from "react";
import { Monitor, ShieldCheck, Rocket, AlertTriangle, CheckCircle, Clock, TrendingUp, Activity } from "lucide-react";
import { Card, Badge, LoadingSpinner } from "../components/ui";
import { devicesApi, policiesApi, deploymentsApi } from "../api";
import type { Deployment, Device } from "../types";

export const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDevices: 0, onlineDevices: 0, totalPolicies: 0,
    totalDeployments: 0, pendingDeployments: 0, failedDeployments: 0, successDeployments: 0,
  });
  const [recentDeployments, setRecentDeployments] = useState<Deployment[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [devRes, polRes, depRes] = await Promise.all([
          devicesApi.getAll(), policiesApi.getAll(), deploymentsApi.getAll(),
        ]);
        const devs = devRes.data;
        const deps = depRes.data;
        setDevices(devs);
        setStats({
          totalDevices: devs.length,
          onlineDevices: devs.filter((d: Device) => d.status === "online").length,
          totalPolicies: polRes.data.length,
          totalDeployments: deps.length,
          pendingDeployments: deps.filter((d: Deployment) => d.status === "pending").length,
          failedDeployments: deps.filter((d: Deployment) => d.status === "failed").length,
          successDeployments: deps.filter((d: Deployment) => d.status === "success").length,
        });
        setRecentDeployments(deps.slice(0, 6));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  const successRate = stats.totalDeployments > 0
    ? Math.round((stats.successDeployments / stats.totalDeployments) * 100)
    : 0;

  const statusBadge = (status: string) => {
    if (status === "success") return <Badge variant="success">✓ Success</Badge>;
    if (status === "failed") return <Badge variant="danger">✗ Failed</Badge>;
    return <Badge variant="warning">⏳ Pending</Badge>;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">System overview and real-time activity</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Devices", value: stats.totalDevices, sub: `${stats.onlineDevices} online`, icon: <Monitor className="w-5 h-5" />, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-900/40" },
          { title: "Policies", value: stats.totalPolicies, sub: "Active rule sets", icon: <ShieldCheck className="w-5 h-5" />, color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400", border: "border-purple-100 dark:border-purple-900/40" },
          { title: "Deployments", value: stats.totalDeployments, sub: `${successRate}% success rate`, icon: <Rocket className="w-5 h-5" />, color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400", border: "border-green-100 dark:border-green-900/40" },
          { title: "Need Attention", value: stats.failedDeployments + stats.pendingDeployments, sub: `${stats.failedDeployments} failed, ${stats.pendingDeployments} pending`, icon: <AlertTriangle className="w-5 h-5" />, color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400", border: "border-red-100 dark:border-red-900/40" },
        ].map((s) => (
          <Card key={s.title} className={`card-hover ${s.border}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{s.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.sub}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${s.color}`}>{s.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Success Rate Bar */}
      {stats.totalDeployments > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-gray-900 dark:text-white text-sm">Deployment Success Rate</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{successRate}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${successRate >= 80 ? "bg-green-500" : successRate >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
              style={{ width: `${successRate}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{stats.successDeployments} successful</span>
            <span>{stats.failedDeployments} failed</span>
            <span>{stats.pendingDeployments} pending</span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deployments */}
        <Card padding={false}>
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-gray-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Recent Deployments</h2>
            </div>
            <Badge variant="neutral">{recentDeployments.length}</Badge>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {recentDeployments.length === 0 ? (
              <div className="p-8 text-center">
                <Rocket className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No deployments yet</p>
              </div>
            ) : recentDeployments.map((dep) => (
              <div key={dep.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                <div>
                  <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">{dep.id.slice(0, 12)}...</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(dep.createdAt).toLocaleString()}</p>
                </div>
                {statusBadge(dep.status)}
              </div>
            ))}
          </div>
        </Card>

        {/* Device Status */}
        <Card padding={false}>
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Device Status</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">{stats.onlineDevices} online</span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span className="text-xs text-gray-500">{stats.totalDevices - stats.onlineDevices} offline</span>
            </div>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {devices.length === 0 ? (
              <div className="p-8 text-center">
                <Monitor className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No devices registered</p>
              </div>
            ) : devices.slice(0, 5).map((device) => (
              <div key={device.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${device.status === "online" ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{device.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{device.ip_address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={device.status === "online" ? "success" : "neutral"}>{device.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <CheckCircle className="w-4 h-4" />, label: "Successful", value: stats.successDeployments, color: "text-green-600 dark:text-green-400" },
          { icon: <Clock className="w-4 h-4" />, label: "Pending", value: stats.pendingDeployments, color: "text-yellow-600 dark:text-yellow-400" },
          { icon: <AlertTriangle className="w-4 h-4" />, label: "Failed", value: stats.failedDeployments, color: "text-red-600 dark:text-red-400" },
        ].map((s) => (
          <Card key={s.label} className="!p-4 text-center">
            <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};