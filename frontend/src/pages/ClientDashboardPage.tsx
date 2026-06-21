import { useEffect, useState } from "react";
import { Monitor, ShieldCheck, Rocket, AlertTriangle, Clock, CheckCircle, CreditCard, Users, HelpCircle, BookOpen } from "lucide-react";
import { Card, Badge, Button, LoadingSpinner } from "../components/ui";
import { devicesApi, policiesApi, deploymentsApi } from "../api";
import type { Device, Deployment } from "../types";

// CLIENT DASHBOARD
// This is what YOUR PAYING CUSTOMER sees when they log in.
// They only see THEIR data — their devices, policies, deployments.
// They cannot see other clients or your super admin data.
// Think of how AWS Console works — each customer sees only their account.
//
// Key difference from Super Admin:
// - No revenue data
// - No other organizations
// - Has billing/subscription info
// - Has support/docs links
// - Simpler, focused on their work

const CLIENT_SUBSCRIPTION = {
  plan: "Pro",
  devicesUsed: 4,
  devicesLimit: 25,
  policiesUsed: 2,
  policiesLimit: 999,
  renewsAt: "2026-07-20",
  monthlyPrice: 299,
};

export const ClientDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [stats, setStats] = useState({ total: 0, online: 0, pending: 0, failed: 0, success: 0 });

  useEffect(() => {
    Promise.all([devicesApi.getAll(), deploymentsApi.getAll()])
      .then(([devRes, depRes]) => {
        const devs = devRes.data;
        const deps = depRes.data;
        setDevices(devs);
        setDeployments(deps.slice(0, 5));
        setStats({
          total: devs.length,
          online: devs.filter((d: Device) => d.status === "online").length,
          pending: deps.filter((d: Deployment) => d.status === "pending").length,
          failed: deps.filter((d: Deployment) => d.status === "failed").length,
          success: deps.filter((d: Deployment) => d.status === "success").length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const deviceUsagePct = Math.round((CLIENT_SUBSCRIPTION.devicesUsed / CLIENT_SUBSCRIPTION.devicesLimit) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Welcome back, Acme Corp 👋</h1>
          <p className="page-subtitle">Your firewall network is protected — here's your overview</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-2">
          <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Pro Plan</span>
        </div>
      </div>

      {/* Status Banner */}
      {stats.failed > 0 ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-800 dark:text-red-300">Action Required</p>
            <p className="text-sm text-red-600 dark:text-red-400">{stats.failed} deployment(s) failed. Check your logs for details.</p>
          </div>
          <Button variant="danger" size="sm" className="ml-auto">View Logs</Button>
        </div>
      ) : (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            All systems operational — your firewall policies are active and enforced
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Protected Devices", value: stats.total, sub: `${stats.online} online`, icon: <Monitor className="w-5 h-5" />, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
          { label: "Active Policies", value: CLIENT_SUBSCRIPTION.policiesUsed, sub: "Enforced now", icon: <ShieldCheck className="w-5 h-5" />, color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
          { label: "Pending", value: stats.pending, sub: "Deploying soon", icon: <Clock className="w-5 h-5" />, color: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400" },
          { label: "Successful", value: stats.success, sub: "All time", icon: <CheckCircle className="w-5 h-5" />, color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" },
        ].map((s) => (
          <Card key={s.label} className="card-hover">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.sub}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${s.color}`}>{s.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card padding={false}>
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Rocket className="w-4 h-4 text-blue-500" />Recent Deployments
              </h2>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {deployments.length === 0 ? (
                <p className="p-6 text-sm text-gray-500 text-center">No deployments yet</p>
              ) : deployments.map((dep) => {
                const deviceId = dep.device_id || dep.deviceId;
                const device = devices.find((d) => d.id === deviceId);
                const createdAt = dep.created_at || dep.createdAt;
                return (
                  <div key={dep.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/20">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${dep.status === "success" ? "bg-green-500" : dep.status === "failed" ? "bg-red-500" : "bg-yellow-500"}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{device?.name || "Unknown device"}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{createdAt ? new Date(createdAt).toLocaleString() : "—"}</p>
                      </div>
                    </div>
                    <Badge variant={dep.status === "success" ? "success" : dep.status === "failed" ? "danger" : "warning"}>
                      {dep.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Subscription */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Subscription</h3>
              <Badge variant="info">Pro</Badge>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Devices</span>
                  <span>{CLIENT_SUBSCRIPTION.devicesUsed} / {CLIENT_SUBSCRIPTION.devicesLimit}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${deviceUsagePct}%` }} />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Renews <strong className="text-gray-900 dark:text-white">{CLIENT_SUBSCRIPTION.renewsAt}</strong> · ${CLIENT_SUBSCRIPTION.monthlyPrice}/mo
              </p>
              <Button variant="secondary" size="sm" className="w-full justify-center">Manage Billing</Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: <Monitor className="w-4 h-4" />, label: "Add Device", color: "text-blue-600 dark:text-blue-400" },
                { icon: <ShieldCheck className="w-4 h-4" />, label: "New Policy", color: "text-purple-600 dark:text-purple-400" },
                { icon: <Rocket className="w-4 h-4" />, label: "Deploy Now", color: "text-green-600 dark:text-green-400" },
                { icon: <Users className="w-4 h-4" />, label: "Invite Team", color: "text-orange-600 dark:text-orange-400" },
              ].map((a) => (
                <button key={a.label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left">
                  <span className={a.color}>{a.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{a.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Support */}
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Help & Support</h3>
            <div className="space-y-2">
              {[
                { icon: <BookOpen className="w-4 h-4" />, label: "Documentation" },
                { icon: <HelpCircle className="w-4 h-4" />, label: "Contact Support" },
              ].map((a) => (
                <button key={a.label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left">
                  <span className="text-gray-400">{a.icon}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{a.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};