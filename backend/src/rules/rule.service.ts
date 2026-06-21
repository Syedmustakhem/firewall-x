import { RuleRepository } from "./rule.repository.js";

const repository = new RuleRepository();

export class RuleService {

  async create(
    policyId: string,
    name: string,
    source: string,
    destination: string,
    protocol: string,
    port: string,
    action: string,
    priority: number
  ) {
    return await repository.create(
      policyId, name, source, destination, protocol, port, action, priority
    );
  }

  async getAll() {
    return await repository.getAll();
  }

  async getByPolicy(policyId: string) {
    return await repository.getByPolicyId(policyId);
  }

  async delete(ruleId: string) {
    return await repository.delete(ruleId);
  }

}