import { Request, Response } from "express";
import { PolicyService } from "./policy.service.js";

const policyService = new PolicyService();

export class PolicyController {

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description } = req.body;
      const organizationId = req.body.organizationId?.trim();
      const result = await policyService.createPolicy(organizationId, name, description);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const result = await policyService.getAllPolicies();
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getOne(req: Request, res: Response): Promise<Response> {
    try {
      const { policyId } = req.params;
      const result = await policyService.getPolicy(policyId);
      if (!result) return res.status(404).json({ message: "Policy not found" });
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { policyId } = req.params;
      await policyService.deletePolicy(policyId);
      return res.json({ message: "Policy deleted" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getConfig(req: Request<{ policyId: string }>, res: Response): Promise<Response> {
    try {
      const { policyId } = req.params;
      const config = await policyService.getPolicyWithRules(policyId);
      return res.status(200).json(config);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

}