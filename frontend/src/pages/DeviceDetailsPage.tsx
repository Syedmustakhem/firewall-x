import { useParams } from "react-router-dom";
import {
  Server,
  Cpu,
  HardDrive,
  Network,
  Shield,
  Activity,
  Clock,
} from "lucide-react";

import { Card, Badge } from "../components/ui";

export const DeviceDetailsPage = () => {
  const { id } = useParams();

  // Mock Data (replace with API later)
  const device = {
    id,
    name: "Branch Firewall 01",
    hostname: "fw-branch-01",
    ip: "192.168.1.10",
    status: "online",
    os: "Ubuntu 24.04",
    version: "FirewallX Agent v1.0.0",
    cpu: 32,
    memory: 68,
    disk: 54,
    policy: "Corporate Policy",
    uptime: "12 Days",
    lastSeen: new Date().toLocaleString(),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">Device Details</h1>
        <p className="page-subtitle">
          Complete information about this firewall device
        </p>
      </div>

      {/* Overview */}
      <Card>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {device.name}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Device ID: {device.id}
            </p>
          </div>

          <Badge
            variant={device.status === "online" ? "success" : "danger"}
          >
            {device.status}
          </Badge>
        </div>
      </Card>

      {/* System Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Server className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">System Information</h3>
          </div>

          <div className="space-y-2 text-sm">
            <p><strong>Hostname:</strong> {device.hostname}</p>
            <p><strong>IP Address:</strong> {device.ip}</p>
            <p><strong>Operating System:</strong> {device.os}</p>
            <p><strong>Agent Version:</strong> {device.version}</p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">Policy Information</h3>
          </div>

          <div className="space-y-2 text-sm">
            <p><strong>Assigned Policy:</strong> {device.policy}</p>
            <p><strong>Status:</strong> Active</p>
            <p><strong>Last Deployment:</strong> Today</p>
          </div>
        </Card>
      </div>

      {/* Performance */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-5 h-5 text-orange-500" />
            <span className="font-medium">CPU Usage</span>
          </div>

          <div className="text-3xl font-bold">
            {device.cpu}%
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-purple-500" />
            <span className="font-medium">Memory Usage</span>
          </div>

          <div className="text-3xl font-bold">
            {device.memory}%
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <HardDrive className="w-5 h-5 text-green-500" />
            <span className="font-medium">Disk Usage</span>
          </div>

          <div className="text-3xl font-bold">
            {device.disk}%
          </div>
        </Card>
      </div>

      {/* Network */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Network className="w-5 h-5 text-cyan-500" />
          <h3 className="font-semibold">Network Information</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <p><strong>Inbound Traffic:</strong> 1.4 GB</p>
          <p><strong>Outbound Traffic:</strong> 2.1 GB</p>
          <p><strong>Active Connections:</strong> 452</p>
          <p><strong>Blocked Requests:</strong> 184</p>
        </div>
      </Card>

      {/* Heartbeat */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold">Heartbeat Status</h3>
        </div>

        <div className="space-y-2 text-sm">
          <p><strong>Last Seen:</strong> {device.lastSeen}</p>
          <p><strong>Uptime:</strong> {device.uptime}</p>
          <p><strong>Latency:</strong> 18 ms</p>
        </div>
      </Card>
    </div>
  );
};