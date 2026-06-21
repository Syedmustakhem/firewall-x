import api from "./client";
import type { AuthResponse, Device, Policy, Rule, Deployment, DeploymentLog } from "../types";

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>("/auth/register", { name, email, password }),
  me: () => api.get<{ user: AuthResponse["user"] }>("/auth/me"),
};

// ─── DEVICES ─────────────────────────────────────────────────────────────────
export const devicesApi = {
  getAll: () => api.get<Device[]>("/devices"),
  getOne: (id: string) => api.get<Device>(`/devices/${id}`),
  create: (data: { name: string; ipAddress: string }) =>
    api.post<Device>("/devices", data),
  update: (id: string, data: Partial<Device>) =>
    api.patch<Device>(`/devices/${id}`, data),
  delete: (id: string) => api.delete(`/devices/${id}`),
};

// ─── POLICIES ────────────────────────────────────────────────────────────────
export const policiesApi = {
  getAll: () => api.get<Policy[]>("/policies"),
  getOne: (id: string) => api.get<Policy>(`/policies/${id}`),
  create: (data: { name: string; description: string }) =>
    api.post<Policy>("/policies", data),
  update: (id: string, data: Partial<Policy>) =>
    api.patch<Policy>(`/policies/${id}`, data),
  delete: (id: string) => api.delete(`/policies/${id}`),
};

// ─── RULES ───────────────────────────────────────────────────────────────────
export const rulesApi = {
  getByPolicy: (policyId: string) =>
    api.get<Rule[]>(`/rules?policyId=${policyId}`),
  create: (data: Omit<Rule, "id" | "createdAt">) =>
    api.post<Rule>("/rules", data),
  update: (id: string, data: Partial<Rule>) =>
    api.patch<Rule>(`/rules/${id}`, data),
  delete: (id: string) => api.delete(`/rules/${id}`),
};

// ─── DEPLOYMENTS ─────────────────────────────────────────────────────────────
export const deploymentsApi = {
  getAll: () => api.get<Deployment[]>("/deployments"),
  getOne: (id: string) => api.get<Deployment>(`/deployments/${id}`),
  create: (data: { deviceId: string; policyId: string }) =>
    api.post<Deployment>("/deployments", data),
  updateStatus: (id: string, status: string) =>
    api.patch<Deployment>(`/deployments/${id}/status`, { status }),
};

// ─── DEPLOYMENT LOGS ─────────────────────────────────────────────────────────
export const deploymentLogsApi = {
  getByDeployment: (deploymentId: string) =>
    api.get<DeploymentLog[]>(`/deployment-logs/${deploymentId}`),
};