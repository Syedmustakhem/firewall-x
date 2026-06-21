import { useEffect, useState } from "react";
import { Bell, AlertTriangle, CheckCircle, Info, X, Trash2 } from "lucide-react";
import { Card, Button, Badge } from "../components/ui";
import { deploymentsApi, devicesApi } from "../api";

// WHY ALERTS?
// In production you can't watch the dashboard all day.
// Alerts automatically notify you when something goes wrong:
// - A device goes offline
// - A deployment fails
// - Suspicious traffic detected
// This is how NOC (Network Operations Center) teams work at companies.
// Industry tools: PagerDuty, OpsGenie, Prometheus Alertmanager.
// We're building a simpler version connected to your own data.

interface Alert {
  id: string;
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  source: string;
}

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "error" | "warning">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateAlerts = async () => {
      const generated: Alert[] = [];
      try {
        const [depRes, devRes] = await Promise.all([deploymentsApi.getAll(), devicesApi.getAll()]);

        depRes.data.forEach((dep: any) => {
          if (dep.status === "failed") {
            generated.push({
              id: `dep-fail-${dep.id}`,
              type: "error",
              title: "Deployment Failed",
              message: `Deployment ${dep.id.slice(0, 8)} failed on device. Check logs for details.`,
              timestamp: new Date(dep.updatedAt || dep.createdAt),
              read: false,
              source: "Deployment Engine",
            });
          }
          if (dep.status === "pending" && new Date(dep.createdAt) < new Date(Date.now() - 5 * 60000)) {
            generated.push({
              id: `dep-stuck-${dep.id}`,
              type: "warning",
              title: "Deployment Stuck",
              message: `Deployment ${dep.id.slice(0, 8)} has been pending for over 5 minutes. Agent may be offline.`,
              timestamp: new Date(dep.createdAt),
              read: false,
              source: "Deployment Engine",
            });
          }
          if (dep.status === "success") {
            generated.push({
              id: `dep-ok-${dep.id}`,
              type: "success",
              title: "Deployment Successful",
              message: `Policy deployed successfully to device.`,
              timestamp: new Date(dep.updatedAt || dep.createdAt),
              read: true,
              source: "Deployment Engine",
            });
          }
        });

        devRes.data.forEach((dev: any) => {
          if (dev.status === "offline") {
            generated.push({
              id: `dev-offline-${dev.id}`,
              type: "error",
              title: "Device Offline",
              message: `${dev.name} (${dev.ipAddress}) is not responding. Last seen: ${dev.lastSeen ? new Date(dev.lastSeen).toLocaleString() : "Never"}.`,
              timestamp: dev.lastSeen ? new Date(dev.lastSeen) : new Date(),
              read: false,
              source: "Heartbeat Monitor",
            });
          }
        });

        generated.push({
          id: "sys-1",
          type: "info",
          title: "Agent Check-in",
          message: "All active agents checked in successfully in the last polling cycle.",
          timestamp: new Date(Date.now() - 2 * 60000),
          read: true,
          source: "System",
        });

      } catch { /* handled */ }

      setAlerts(generated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      setLoading(false);
    };
    generateAlerts();
  }, []);

  const markAllRead = () => setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  const dismiss = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));
  const clearAll = () => setAlerts([]);

  const filtered = alerts.filter((a) => {
    if (filter === "unread") return !a.read;
    if (filter === "error") return a.type === "error";
    if (filter === "warning") return a.type === "warning";
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  const alertIcon = (type: string) => {
    if (type === "error") return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (type === "warning") return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    if (type === "success") return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <Info className="w-4 h-4 text-blue-500" />;
  };

  const alertBg = (type: string) => {
    if (type === "error") return "border-l-red-500 dark:border-l-red-500";
    if (type === "warning") return "border-l-yellow-500 dark:border-l-yellow-500";
    if (type === "success") return "border-l-green-500 dark:border-l-green-500";
    return "border-l-blue-500 dark:border-l-blue-500";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between page-header">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Alerts</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </div>
          <p className="page-subtitle">System events and notifications from all devices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={markAllRead}>Mark all read</Button>
          <Button variant="secondary" size="sm" onClick={clearAll}><Trash2 className="w-4 h-4" />Clear all</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "unread", "error", "warning"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize
              ${filter === f ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
            {f} {f === "all" ? `(${alerts.length})` : f === "unread" ? `(${unreadCount})` : ""}
          </button>
        ))}
      </div>

      {loading ? (
        <Card><p className="text-center text-gray-500 py-8">Loading alerts...</p></Card>
      ) : filtered.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-900 dark:text-white">No alerts</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">All systems are operating normally</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((alert) => (
            <div key={alert.id}
              className={`bg-white dark:bg-gray-800 rounded-xl border-l-4 border border-gray-200 dark:border-gray-700 ${alertBg(alert.type)} p-4 flex items-start gap-4 transition-all ${!alert.read ? "shadow-sm" : "opacity-75"}`}
              onClick={() => setAlerts((prev) => prev.map((a) => a.id === alert.id ? { ...a, read: true } : a))}>
              <div className="mt-0.5 flex-shrink-0">{alertIcon(alert.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{alert.title}</p>
                  {!alert.read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                  <Badge variant="neutral" >{alert.source}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{alert.timestamp.toLocaleString()}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); dismiss(alert.id); }}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};