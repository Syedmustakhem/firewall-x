import { PolicyRepository } from "./policy.repository.js";

const policyRepository = new PolicyRepository();

export class PolicyService {

  async createPolicy(organizationId: string, name: string, description: string) {
    return await policyRepository.create(organizationId, name, description);
  }

  async getAllPolicies() {
    return await policyRepository.getAll();
  }

  async getPolicy(policyId: string) {
    return await policyRepository.findById(policyId);
  }

  async deletePolicy(policyId: string) {
    return await policyRepository.delete(policyId);
  }

  async getPolicyConfig(policyId: string) {
    return await policyRepository.findById(policyId);
  }

  async getPolicyWithRules(policyId: string) {
    const policy = await policyRepository.findById(policyId);
    if (!policy) throw new Error("Policy not found");
    const rules = await policyRepository.getRules(policyId);
    return { policy, rules };
  }

}