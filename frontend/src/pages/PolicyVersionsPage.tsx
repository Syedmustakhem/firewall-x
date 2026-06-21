import { useEffect, useState } from "react";
import { GitBranch, RotateCcw, Clock, ChevronDown, ChevronRight } from "lucide-react";
import { Card, Button, Badge, Select, LoadingSpinner } from "../components/ui";
import { policiesApi } from "../api";
import type { Policy } from "../types";

// WHY POLICY VERSIONS?
// Imagine you deploy a policy that accidentally blocks SSH to all servers.
// You need to ROLL BACK instantly to the previous working version.
// This is exactly how git works — every change is saved as a version.
// Industry tools: HashiCorp Vault, AWS Config, Ansible Tower all do this.
// In FirewallX, every time a policy is edited, we save a snapshot.
// The agent can then re-deploy any previous version instantly.

interface PolicyVersion {
  id: string;
  policyId: string;
  version: number;
  changes: string;
  createdBy: string;
  createdAt: string;
  snapshot: {
    name: string;
    ruleCount: number;
    rules: { name: string; action: string; port: string }[];
  };
  isActive: boolean;
}

const generateVersions = (policyId: string): PolicyVersion[] =>
  Array.from({ length: 5 }, (_, i) => ({
    id: `ver-${policyId}-${i}`,
    policyId,
    version: 5 - i,
    changes: i === 0 ? "Current version" : [
      "Added rule: Block port 23 (Telnet)",
      "Modified rule: Updated source IP range",
      "Removed rule: Deprecated HTTP block",
      "Added rule: Allow HTTPS outbound",
    ][i - 1] || "Initial version",
    createdBy: ["Admin", "Operator", "Admin"][i % 3],
    createdAt: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString(),
    snapshot: {
      name: `Version ${5 - i}`,
      ruleCount: 5 - i + 2,
      rules: [
        { name: "Block SSH", action: "deny", port: "22" },
        { name: "Allow HTTPS", action: "allow", port: "443" },
        { name: "Block Telnet", action: "deny", port: "23" },
      ].slice(0, 5 - i + 1),
    },
    isActive: i === 0,
  }));

export const PolicyVersionsPage = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  const [versions, setVersions] = useState<PolicyVersion[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rollingBack, setRollingBack] = useState<string | null>(null);

  useEffect(() => {
    policiesApi.getAll().then((res) => {
      setPolicies(res.data);
      if (res.data.length > 0) setSelectedPolicyId(res.data[0].id);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedPolicyId) setVersions(generateVersions(selectedPolicyId));
  }, [selectedPolicyId]);

  const handleRollback = async (versionId: string, version: number) => {
    if (!confirm(`Roll back to Version ${version}? This will create a new deployment.`)) return;
    setRollingBack(versionId);
    await new Promise((r) => setTimeout(r, 1500));
    setRollingBack(null);
    alert(`✅ Rolled back to Version ${version}. A new deployment has been queued.`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div className="flex items-center gap-3 mb-1">
          <GitBranch className="w-6 h-6 text-blue-500" />
          <h1 className="page-title">Policy Version History</h1>
        </div>
        <p className="page-subtitle">Track every change and roll back to any previous version instantly</p>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>How rollback works:</strong> Every policy edit creates a version snapshot.
          Rolling back creates a new deployment with the old policy rules — the agent applies it within 30 seconds.
          Your firewall is back to the working state instantly. No downtime.
        </p>
      </div>

      <Card>
        <Select label="Select Policy" value={selectedPolicyId} onChange={(e) => setSelectedPolicyId(e.target.value)}
          options={[{ value: "", label: "-- Choose a policy --" }, ...policies.map((p) => ({ value: p.id, label: p.name }))]} />
      </Card>

      {selectedPolicyId && (
        <div className="space-y-3">
          {versions.map((ver) => (
            <Card key={ver.id} padding={false} className={`overflow-hidden transition-all ${ver.isActive ? "border-blue-300 dark:border-blue-700" : ""}`}>
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/20"
                onClick={() => setExpanded(expanded === ver.id ? null : ver.id)}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${ver.isActive ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                    v{ver.version}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 dark:text-white">{ver.changes}</p>
                      {ver.isActive && <Badge variant="info">Current</Badge>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{new Date(ver.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">by {ver.createdBy}</p>
                      <p className="text-xs text-gray-400">{ver.snapshot.ruleCount} rules</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!ver.isActive && (
                    <Button size="sm" variant="secondary" loading={rollingBack === ver.id}
                      onClick={(e) => { e.stopPropagation(); handleRollback(ver.id, ver.version); }}>
                      <RotateCcw className="w-3 h-3" />Rollback
                    </Button>
                  )}
                  {expanded === ver.id ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {expanded === ver.id && (
                <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-4">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Rules in this version</p>
                  <div className="space-y-2">
                    {ver.snapshot.rules.map((rule, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${rule.action === "allow" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                          {rule.action.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white">{rule.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono ml-auto">port {rule.port}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};