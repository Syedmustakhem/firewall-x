import { RuleRepository }
from "../rules/rule.repository.js";

const ruleRepository =
  new RuleRepository();

export class CompilerService {

  compilePolicy(
    policyId: string
  ) {

    const rules =
      ruleRepository.findByPolicyId(
        policyId
      );

    return rules.map(rule => {

      const action =
        rule.action === "allow"
          ? "accept"
          : "drop";

      return `nft add rule inet filter forward ${rule.protocol} dport ${rule.port} ${action}`;

    });

  }

}