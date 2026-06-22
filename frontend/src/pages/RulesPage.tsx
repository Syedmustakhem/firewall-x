import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ListFilter, Plus, Trash2, Shield } from "lucide-react";
import { Card, Button, Badge, Modal, Input, Select, EmptyState, LoadingSpinner } from "../components/ui/index";
import { rulesApi, policiesApi } from "../api/index";
import type { Rule, Policy } from "../types/index";

export const RulesPage = () => {
  const [searchParams] = useSearchParams();
  const policyId = searchParams.get("policyId") || "";

  const [rules, setRules] = useState<Rule[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState(policyId);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", action: "deny", protocol: "tcp",
    source: "0.0.0.0/0", destination: "0.0.0.0/0",
    port: "any", priority: 100,
  });

  useEffect(() => {
    policiesApi.getAll().then((res) => setPolicies(res.data));
  }, []);

  const loadRules = (pid: string) => {
    if (!pid) return;
    setLoading(true);
    rulesApi.getByPolicy(pid).then((res) => setRules(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadRules(selectedPolicyId); }, [selectedPolicyId]);

  const handleCreate = async () => {
    if (!selectedPolicyId) return setError("Select a policy first");
    if (!form.name) return setError("Rule name is required");
    setSaving(true); setError("");
    try {
      await rulesApi.create({
        policyId: selectedPolicyId,
        name: form.name,
        source: form.source,
        destination: form.destination,
        protocol: form.protocol,
        port: form.port,
        action: form.action,
        priority: Number(form.priority),
      } as any);
      setModalOpen(false);
      setForm({ name: "", action: "deny", protocol: "tcp", source: "0.0.0.0/0", destination: "0.0.0.0/0", port: "any", priority: 100 });
      loadRules(selectedPolicyId);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create rule");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this rule?")) return;
    await rulesApi.delete(id);
    loadRules(selectedPolicyId);
  };

  const actionBadge = (action: string) => {
    if (action === "allow") return <Badge variant="success">✓ ALLOW</Badge>;
    if (action === "deny") return <Badge variant="danger">✗ DENY</Badge>;
    return <Badge variant="warning">⊘ DROP</Badge>;
  };

  const selectedPolicy = policies.find((p) => p.id === selectedPolicyId);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Rules</h1>
          <p className="page-subtitle">Firewall instructions inside a policy — compiled to nftables</p>
        </div>
        <Button onClick={() => setModalOpen(true)} disabled={!selectedPolicyId}>
          <Plus className="w-4 h-4" />Add Rule
        </Button>
      </div>

      {/* Policy Selector */}
      <Card>
        <Select
          label="Select Policy"
          value={selectedPolicyId}
          onChange={(e) => setSelectedPolicyId(e.target.value)}
          options={[
            { value: "", label: "-- Choose a policy --" },
            ...policies.map((p) => ({ value: p.id, label: p.name }))
          ]}
        />
        {selectedPolicy && (
          <div className="mt-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedPolicy.description || "No description"}
            </span>
            <span className="text-xs text-gray-400">· {rules.length} rules</span>
          </div>
        )}
      </Card>

      {/* Rules Table */}
      {loading ? <LoadingSpinner /> : !selectedPolicyId ? (
        <Card>
          <EmptyState
            icon={<ListFilter className="w-12 h-12" />}
            title="Select a policy"
            description="Choose a policy above to view and manage its firewall rules."
          />
        </Card>
      ) : rules.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ListFilter className="w-12 h-12" />}
            title="No rules yet"
            description="Add your first rule to define what traffic is allowed or denied on this policy."
            action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" />Add Rule</Button>}
          />
        </Card>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {["#", "Name", "Action", "Protocol", "Source", "Destination", "Port", ""].map((h) => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {rules.map((rule, i) => (
                  <tr key={rule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors group">
                    <td className="table-cell text-gray-400 dark:text-gray-500 font-mono">{i + 1}</td>
                    <td className="table-cell font-medium text-gray-900 dark:text-white">{rule.name}</td>
                    <td className="table-cell">{actionBadge(rule.action)}</td>
                    <td className="table-cell text-gray-600 dark:text-gray-400 uppercase font-mono text-xs">{rule.protocol}</td>
                    <td className="table-cell text-gray-600 dark:text-gray-400 font-mono text-xs">
  {rule.sourceIp || rule.source_ip || "any"}
</td>

<td className="table-cell text-gray-600 dark:text-gray-400 font-mono text-xs">
  {rule.destinationIp || rule.destination_ip || "any"}
</td>
                    <td className="table-cell">
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded font-mono text-xs">
                        {rule.port || "any"}
                      </span>
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleDelete(rule.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {rules.length} rule{rules.length !== 1 ? "s" : ""} — executed in priority order by the nftables compiler
            </p>
          </div>
        </Card>
      )}

      {/* Add Rule Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setError(""); }}
        title="Add Firewall Rule"
        footer={<>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} loading={saving}>
            <Plus className="w-4 h-4" />Add Rule
          </Button>
        </>}>
        <div className="space-y-4">
          <Input
            label="Rule Name"
            placeholder="e.g. Block SSH"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Action" value={form.action}
              onChange={(e) => setForm({ ...form, action: e.target.value })}
              options={[
                { value: "allow", label: "✓ Allow" },
                { value: "deny", label: "✗ Deny" },
                { value: "drop", label: "⊘ Drop" },
              ]} />
            <Select label="Protocol" value={form.protocol}
              onChange={(e) => setForm({ ...form, protocol: e.target.value })}
              options={[
                { value: "tcp", label: "TCP" },
                { value: "udp", label: "UDP" },
                { value: "icmp", label: "ICMP" },
                { value: "any", label: "Any" },
              ]} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Source IP" placeholder="0.0.0.0/0"
              value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
            <Input label="Destination IP" placeholder="0.0.0.0/0"
              value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Port" placeholder="22 or any"
              value={form.port} onChange={(e) => setForm({ ...form, port: e.target.value })} />
            <Input label="Priority" type="number"
              value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <strong>Example:</strong> Name: "Block SSH" · Action: Deny · Protocol: TCP · Port: 22<br/>
              This blocks all SSH connections to this device.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};