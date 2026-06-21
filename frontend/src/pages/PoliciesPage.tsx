import { useEffect, useState } from "react";
import { ShieldCheck, Plus, Trash2, ChevronRight, RefreshCw } from "lucide-react";
import { Card, Button, Badge, Modal, Input, EmptyState, LoadingSpinner } from "../components/ui/index";
import { policiesApi } from "../api/index";
import type { Policy } from "../types/index";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ORG_ID = "750dd986-13be-44fd-8bec-6c96e8139a9c";

export const PoliciesPage = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const load = async () => {
    setLoading(true);
    try {
      const res = await policiesApi.getAll();
      setPolicies(res.data);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.name) return setError("Policy name is required");
    setSaving(true); setError("");
    try {
      await policiesApi.create({
        name: form.name,
        description: form.description,
        organizationId: ORG_ID,
      } as any);
      setModalOpen(false);
      setForm({ name: "", description: "" });
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create policy");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this policy?")) return;
    await policiesApi.delete(id);
    load();
  };

  const statusBadge = (status: string) => {
    if (status === "active") return <Badge variant="success">Active</Badge>;
    if (status === "draft") return <Badge variant="warning">Draft</Badge>;
    return <Badge variant="neutral">Inactive</Badge>;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Policies</h1>
          <p className="page-subtitle">Named collections of firewall rules — deploy to any device</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
          <Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" />New Policy</Button>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>How policies work:</strong> A policy is a named group of firewall rules.
          Create a policy, add rules to it, then deploy it to any device.
          The agent applies the rules via nftables within 30 seconds.
        </p>
      </div>

      {/* Summary */}
      {policies.length > 0 && (
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-900 dark:text-white">{policies.length} policies</span>
          <span>·</span>
          <span>{policies.filter((p) => p.status === "active").length} active</span>
          <span>·</span>
          <span>{policies.filter((p) => p.status === "draft" || !p.status).length} draft</span>
        </div>
      )}

      {policies.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ShieldCheck className="w-12 h-12" />}
            title="No policies yet"
            description="Create your first firewall policy and add rules to it. Then deploy it to your devices."
            action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" />New Policy</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {policies.map((policy) => (
            <Card
              key={policy.id}
              padding={false}
              className="cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200 group"
              onClick={() => navigate(`/rules?policyId=${policy.id}`)}>
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                    <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {policy.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {policy.description || "No description"}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">
                      {policy.id.slice(0, 16)}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {statusBadge(policy.status)}
                  <p className="text-xs text-gray-400 hidden md:block">
                    {new Date(policy.createdAt || policy.created_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={(e) => handleDelete(policy.id, e)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Policy Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setError(""); }}
        title="Create New Policy"
        footer={<>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} loading={saving}>
            <ShieldCheck className="w-4 h-4" />Create Policy
          </Button>
        </>}>
        <div className="space-y-4">
          <Input
            label="Policy Name"
            placeholder="e.g. Block Social Media"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoFocus
          />
          <Input
            label="Description"
            placeholder="What does this policy do?"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
          )}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              After creating, click the policy to add firewall rules to it.
              Then deploy it to your devices.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};