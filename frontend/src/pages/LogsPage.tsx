import { useEffect, useState } from "react";
import { FileText, RefreshCw } from "lucide-react";
import { Card, Badge, Select, EmptyState, LoadingSpinner } from "../components/ui/index";
import { deploymentLogsApi, deploymentsApi } from "../api/index";
import type { DeploymentLog, Deployment } from "../types/index";

// WHY LOGS PAGE?
// When an agent runs a deployment, it logs every step:
// "Config Downloaded", "Validation Passed", "Execution Success/Failed"
// This page lets you debug exactly what happened on any device.
// Critical for production — without logs, you're flying blind.

export const LogsPage = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [logs, setLogs] = useState<DeploymentLog[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    deploymentsApi.getAll().then((res) => {
      setDeployments(res.data);
      if (res.data.length > 0) setSelectedId(res.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    deploymentLogsApi.getByDeployment(selectedId).then((res) => setLogs(res.data)).finally(() => setLoading(false));
  }, [selectedId]);

  const logBadge = (status: string) => {
    if (status === "success") return <Badge variant="success">✓</Badge>;
    if (status === "failed") return <Badge variant="danger">✗</Badge>;
    return <Badge variant="info">i</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deployment Logs</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Step-by-step execution history from the agent</p>
        </div>
        <button onClick={() => setSelectedId(selectedId)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <Card>
        <Select label="Select Deployment" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}
          options={[{ value: "", label: "-- Choose a deployment --" }, ...deployments.map((d) => ({
            value: d.id, label: `${d.id.slice(0, 12)}... — ${d.status} — ${new Date(d.createdAt).toLocaleString()}`
          }))]} />
      </Card>

      {loading ? <LoadingSpinner /> : !selectedId ? (
        <Card><EmptyState icon={<FileText className="w-12 h-12" />} title="Select a deployment" description="Choose a deployment above to see its execution logs." /></Card>
      ) : logs.length === 0 ? (
        <Card><EmptyState icon={<FileText className="w-12 h-12" />} title="No logs found" description="This deployment has no logs yet. The agent may not have processed it." /></Card>
      ) : (
        <Card padding={false}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Execution Timeline</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {logs.map((log, i) => (
              <div key={log.id} className="flex items-start gap-4 p-4">
                <div className="flex flex-col items-center">
                  <div className="mt-0.5">{logBadge(log.status)}</div>
                  {i < logs.length - 1 && <div className="w-px h-full bg-gray-200 dark:bg-gray-700 mt-2" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{log.step}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 ml-4">{new Date(log.createdAt).toLocaleTimeString()}</p>
                  </div>
                  {log.message && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-mono">{log.message}</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};