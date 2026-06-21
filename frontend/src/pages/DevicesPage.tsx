import { useEffect, useState } from "react";
import { Monitor, Plus, Trash2, RefreshCw, Wifi, WifiOff, Server } from "lucide-react";
import { Card, Button, Badge, Modal, Input, EmptyState, LoadingSpinner } from "../components/ui";
import { devicesApi } from "../api";
import type { Device } from "../types";

export const DevicesPage = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", hostname: "", ipAddress: "", organizationId: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await devicesApi.getAll();
      setDevices(res.data);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.ipAddress || !form.organizationId)
      return setError("Name, IP Address and Organization ID are required");
    setSaving(true); setError("");
    try {
      await devicesApi.create({
        name: form.name,
        hostname: form.hostname || form.name,
        ipAddress: form.ipAddress,
        organizationId: form.organizationId.trim(),
      } as any);
      setModalOpen(false);
      setForm({ name: "", hostname: "", ipAddress: "", organizationId: "" });
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create device");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this device?")) return;
    await devicesApi.delete(id);
    load();
  };

  const online = devices.filter((d) => d.status === "online").length;
  const offline = devices.filter((d) => d.status === "offline").length;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Devices</h1>
          <p className="page-subtitle">Machines with the FirewallX agent installed</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" onClick={load}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" />Add Device
          </Button>
        </div>
      </div>

      {/* Summary Row */}
      {devices.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="!p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{devices.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Devices</p>
            </div>
          </Card>
          <Card className="!p-4 flex items-center gap-3 border-green-200 dark:border-green-900/40">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">{online}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
            </div>
          </Card>
          <Card className="!p-4 flex items-center gap-3 border-red-200 dark:border-red-900/40">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <WifiOff className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">{offline}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Offline</p>
            </div>
          </Card>
        </div>
      )}

      {/* Device Grid */}
      {devices.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Monitor className="w-12 h-12" />}
            title="No devices yet"
            description="Register your first device to start deploying firewall policies."
            action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" />Add Device</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => (
            <Card key={device.id} className="card-hover group relative overflow-hidden">
              {/* Status bar on top */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${device.status === "online" ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`} />

              <div className="flex items-start justify-between mb-4 mt-1">
                <div className="flex items-center gap-3">
                  <div className={`relative p-2.5 rounded-xl ${device.status === "online" ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-100 dark:bg-gray-700"}`}>
                    <Monitor className={`w-5 h-5 ${device.status === "online" ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`} />
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${device.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{device.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{device.hostname}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(device.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">IP Address</span>
                  <span className="text-xs font-mono font-medium text-gray-900 dark:text-white">{device.ip_address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={device.status === "online" ? "success" : "danger"}>
                    {device.status === "online" ? "● Online" : "○ Offline"}
                  </Badge>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {device.last_seen
                      ? `Seen ${new Date(device.last_seen).toLocaleDateString()}`
                      : "Never connected"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Device Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setError(""); }}
        title="Add New Device"
        footer={<>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} loading={saving}><Plus className="w-4 h-4" />Add Device</Button>
        </>}>
        <div className="space-y-4">
          <Input label="Device Name" placeholder="e.g. Web Server 01"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Hostname (optional)" placeholder="e.g. webserver01.local"
            value={form.hostname} onChange={(e) => setForm({ ...form, hostname: e.target.value })} />
          <Input label="IP Address" placeholder="e.g. 192.168.1.10"
            value={form.ipAddress} onChange={(e) => setForm({ ...form, ipAddress: e.target.value })} />
          <Input label="Organization ID" placeholder="UUID from your organization"
            value={form.organizationId} onChange={(e) => setForm({ ...form, organizationId: e.target.value })} />
          {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              <strong>Tip:</strong> Your Organization ID is <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded">750dd986-13be-44fd-8bec-6c96e8139a9c</code>
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};