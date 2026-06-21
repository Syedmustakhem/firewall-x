export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "operator" | "viewer";
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Device {
  id: string;
  organization_id: string;
  name: string;
  hostname: string;
  ip_address: string;
  status: "online" | "offline" | "unknown";
  agent_version: string | null;
  last_seen: string | null;
  created_at: string;
}

export interface Policy {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "draft";
  createdAt: string;
  created_at: string;
  rules?: Rule[];
}

export interface Rule {
  id: string;
  policyId: string;
  policy_id: string;
  name: string;
  action: "allow" | "deny" | "drop";
  protocol: "tcp" | "udp" | "icmp" | "any";
  sourceIp: string;
  source_ip: string;
  destinationIp: string;
  destination_ip: string;
  port: string;
  priority: number;
  createdAt: string;
  created_at: string;
}

export interface Deployment {
  id: string;
  deviceId: string;
  device_id: string;
  policyId: string;
  policy_id: string;
  status: "pending" | "success" | "failed";
  device?: Device;
  policy?: Policy;
  createdAt: string;
  created_at: string;
  updatedAt: string;
  updated_at: string;
}

export interface DeploymentLog {
  id: string;
  deploymentId: string;
  deployment_id: string;
  step: string;
  status: "success" | "failed" | "info";
  message: string;
  createdAt: string;
  created_at: string;
}

export interface ApiError {
  message: string;
  status?: number;
}