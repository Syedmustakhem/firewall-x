import { useEffect, useState } from "react";
import { Shield, Users, Monitor, Building2, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Activity, Globe } from "lucide-react";
import { Card, Badge, LoadingSpinner } from "../components/ui";
import { devicesApi, deploymentsApi } from "../api";

// SUPER ADMIN DASHBOARD
// This is YOUR dashboard as the FirewallX owner.
// You see across ALL organizations — total revenue, all clients,
// system health, and every deployment happening in real time.
// Real world equivalent: Cisco's internal ops dashboard,
// Cloudflare's internal metrics, Datadog's SRE dashboard.

const MOCK_ORGS = [
  { id: "1", name: "Acme Corp", plan: "Pro", devices: 12, status: "active", monthlyRevenue: 299, country: "US", joinedAt: "2026-01-15" },
  { id: "2", name: "TechStart Ltd", plan: "Starter", devices: 4, status: "active", monthlyRevenue: 49, country: "UK", joinedAt: "2026-02-20" },
  { id: "3", name: "FinanceHub", plan: "Enterprise", devices: 87, status: "active", monthlyRevenue: 999, country: "AE", joinedAt: "2025-11-01" },
  { id: "4", name: "RetailCo", plan: "Free", devices: 1, status: "trial", monthlyRevenue: 0, country: "IN", joinedAt: "2026-06-01" },
  { id: "5", name: "MediaGroup", plan: "Pro", devices: 18, status: "active", monthlyRevenue: 299, country: "CA", joinedAt: "2026-03-10" },
];

const PLANS = [
  { name: "Free", price: 0, color: "neutral", features: "1 device, 3 policies" },
  { name: "Starter", price: 49, color: "info", features: "5 devices, 10 policies" },
  { name: "Pro", price: 299, color: "success", features: "25 devices, unlimited policies" },
  { name: "Enterprise", price: 999, color: "danger", features: "Unlimited everything + SLA" },
];

export const SuperAdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [totalDevices, setTotalDevices] = useState(0);
  const [totalDeployments, setTotalDeployments] = useState(0);

  useEffect(() => {
    Promise.all([devicesApi.getAll(), deploymentsApi.getAll()])
      .then(([devRes, depRes]) => {
        setTotalDevices(devRes.data.length);
        setTotalDeployments(depRes.data.length);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalMRR = MOCK_ORGS.reduce((s, o) => s + o.monthlyRevenue, 0);
  const activeOrgs = MOCK_ORGS.filter((o) => o.status === "active").length;
  const totalOrgDevices = MOCK_ORGS.reduce((s, o) => s + o.devices, 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="page-title">Super Admin</h1>
          </div>
          <p className="page-subtitle">Global view across all organizations — only you can see this</p>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-sm font-medium text-purple-700 dark:text-purple-400">FirewallX Owner</span>
        </div>
      </div>

      {/* Revenue + Global Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-200 dark:border-green-900/40 bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monthly Revenue</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-2">${totalMRR.toLocaleString()}</p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">↑ 12% this month</p>
            </div>
            <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Organizations</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{MOCK_ORGS.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activeOrgs} active</p>
            </div>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Devices</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalOrgDevices}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Across all orgs</p>
            </div>
            <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <Monitor className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deployments</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalDeployments}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All time</p>
            </div>
            <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Subscription Plans */}
      <div>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />Subscription Plans
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => {
            const count = MOCK_ORGS.filter((o) => o.plan === plan.name).length;
            return (
              <Card key={plan.name} className="text-center card-hover">
                <Badge variant={plan.color as any}>{plan.name}</Badge>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">{count}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">organizations</p>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-2">
                  {plan.price === 0 ? "Free" : `$${plan.price}/mo`}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{plan.features}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* All Organizations Table */}
      <div>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-500" />All Organizations
        </h2>
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {["Organization", "Plan", "Devices", "Country", "MRR", "Status", "Joined"].map((h) => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {MOCK_ORGS.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {org.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{org.name}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <Badge variant={org.plan === "Enterprise" ? "danger" : org.plan === "Pro" ? "success" : org.plan === "Starter" ? "info" : "neutral"}>
                        {org.plan}
                      </Badge>
                    </td>
                    <td className="table-cell text-gray-600 dark:text-gray-400">{org.devices}</td>
                    <td className="table-cell text-gray-600 dark:text-gray-400">{org.country}</td>
                    <td className="table-cell font-semibold text-green-600 dark:text-green-400">
                      {org.monthlyRevenue === 0 ? "—" : `$${org.monthlyRevenue}`}
                    </td>
                    <td className="table-cell">
                      <Badge variant={org.status === "active" ? "success" : "warning"}>{org.status}</Badge>
                    </td>
                    <td className="table-cell text-gray-500 dark:text-gray-400 text-xs">{org.joinedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};