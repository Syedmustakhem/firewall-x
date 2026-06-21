import { Request, Response } from "express";
import { DeploymentService } from "./deployment.service.js";

const service = new DeploymentService();

export class DeploymentController {

  async create(req: Request, res: Response) {
    try {
      const { deviceId, policyId } = req.body;
      const deployment = await service.create(deviceId, policyId);
      return res.status(201).json(deployment);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const result = await service.getAll();
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getPending(req: Request, res: Response) {
    try {
      const { deviceId } = req.params as { deviceId: string };
      const deployment = await service.getPending(deviceId);
      return res.json(deployment);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { deploymentId } = req.params as { deploymentId: string };
      const { status } = req.body;
      const deployment = await service.updateStatus(deploymentId, status);
      return res.json(deployment);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

}