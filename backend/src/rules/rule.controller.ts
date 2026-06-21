import { Request, Response } from "express";
import { RuleService } from "./rule.service.js";

const service = new RuleService();

export class RuleController {

  async create(req: Request, res: Response) {
    try {
      const {
        policyId,
        name,
        source,
        destination,
        protocol,
        port,
        action,
        priority,
      } = req.body;

      const rule = await service.create(
        policyId,
        name,
        source || "0.0.0.0/0",
        destination || "0.0.0.0/0",
        protocol || "tcp",
        port || "any",
        action || "deny",
        priority || 100
      );

      return res.status(201).json(rule);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { policyId } = req.query;
      const rules = policyId
        ? await service.getByPolicy(policyId as string)
        : await service.getAll();
      return res.json(rules);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { ruleId } = req.params;
      await service.delete(ruleId);
      return res.json({ message: "Rule deleted" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

}