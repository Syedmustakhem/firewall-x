import { useEffect, useState } from "react";
import { Rocket, Plus, RefreshCw, Monitor, ShieldCheck } from "lucide-react";
import { Card, Button, Badge, Modal, Select, EmptyState, LoadingSpinner } from "../components/ui";
import { deploymentsApi, devicesApi, policiesApi } from "../api";
import type { Deployment, Device, Policy } from "../types";

export const DeploymentsPage = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ deviceId: "", policyId: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [depRes, devRes, polRes] = await Promise.all([
        deploymentsApi.getAll(),
        devicesApi.getAll(),
        policiesApi.getAll(),
      ]);
      setDeployments(Array.isArray(depRes.data) ? depRes.data : []);
      setDevices(Array.isArray(devRes.data) ? devRes.data : []);
      setPolicies(Array.isArray(polRes.data) ? polRes.data : []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDeploy = async () => {
    if (!form.deviceId || !form.policyId) return setError("Select both device and policy");
    setSaving(true); setError("");
    try {
      await deploymentsApi.create(form);
      setModalOpen(false);
      setForm({ deviceId: "", policyId: "" });
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create deployment");
    } finally { setSaving(false); }
  };

  const statusBadge = (status: string) => {
    if (status === "success") return <Badge variant="success">✓ Success</Badge>;
    if (status === "failed") return <Badge variant="danger">✗ Failed</Badge>;
    return <Badge variant="warning">⏳ Pending</Badge>;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Deployments</h1>
          <p className="page-subtitle">Push policies to devices via the agent</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
          <Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" />Deploy Policy</Button>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>How it works:</strong> When you deploy, the agent on the device picks it up within 30 seconds,
          applies the nftables rules, and marks the deployment as success or failed.
        </p>
      </div>

      {deployments.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Rocket className="w-12 h-12" />}
            title="No deployments yet"
            description="Deploy your first policy to a device to see it here."
            action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" />Deploy Policy</Button>}
          />
        </Card>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {["ID", "Device", "Policy", "Status", "Created"].map((h) => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {deployments.map((dep) => {
                  // Handle both snake_case (DB) and camelCase
                  const deviceId = dep.device_id || dep.deviceId;
                  const policyId = dep.policy_id || dep.policyId;
                  const createdAt = dep.created_at || dep.createdAt;
                  const device = devices.find((d) => d.id === deviceId);
                  const policy = policies.find((p) => p.id === policyId);

                  return (
                    <tr key={dep.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="table-cell font-mono text-xs text-gray-400 dark:text-gray-500">
                        {dep.id?.slice(0, 12)}...
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${device?.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {device?.name || deviceId?.slice(0, 8)}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {policy?.name || policyId?.slice(0, 8)}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">{statusBadge(dep.status)}</td>
                      <td className="table-cell text-gray-500 dark:text-gray-400 text-xs">
                        {createdAt ? new Date(createdAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setError(""); }}
        title="Deploy Policy to Device"
        footer={<>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleDeploy} loading={saving}>
            <Rocket className="w-4 h-4" />Deploy
          </Button>
        </>}>
        <div className="space-y-4">
          <Select
            label="Select Device"
            value={form.deviceId}
            onChange={(e) => setForm({ ...form, deviceId: e.target.value })}
            options={[
              { value: "", label: "-- Choose a device --" },
              ...devices.map((d) => ({ value: d.id, label: `${d.name} (${d.ip_address})` }))
            ]}
          />
          <Select
            label="Select Policy"
            value={form.policyId}
            onChange={(e) => setForm({ ...form, policyId: e.target.value })}
            options={[
              { value: "", label: "-- Choose a policy --" },
              ...policies.map((p) => ({ value: p.id, label: p.name }))
            ]}
          />
          {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-xs text-yellow-800 dark:text-yellow-400">
              ⚡ The agent will pick this up within <strong>30 seconds</strong> and apply the rules via nftables.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};