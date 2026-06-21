export type DeploymentStatus =
  | "pending"
  | "deploying"
  | "success"
  | "failed";

export interface Deployment {
  id: string;
  deviceId: string;
  policyId: string;
  status: DeploymentStatus;
}