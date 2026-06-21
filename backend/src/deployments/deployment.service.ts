import { DeploymentRepository } from "./deployment.repository.js";

const repository = new DeploymentRepository();

export class DeploymentService {

  async create(deviceId: string, policyId: string) {
    return await repository.create(deviceId, policyId);
  }

  async getAll() {
    return await repository.getAll();
  }

  async getPending(deviceId: string) {
    return await repository.findPendingByDevice(deviceId);
  }

  async updateStatus(deploymentId: string, status: "deploying" | "success" | "failed") {
    return await repository.updateStatus(deploymentId, status);
  }

}