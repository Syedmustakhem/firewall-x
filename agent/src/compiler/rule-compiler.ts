export interface FirewallRule {
  protocol: string;
  port: string;
  action: string;
  source?: string;
  destination?: string;
}

export function compileRule(rule: FirewallRule): string {
  const action = rule.action === "allow" ? "accept" : "drop";

  // If protocol is "any", don't filter by protocol
  if (rule.protocol === "any") {
    if (rule.port === "any" || !rule.port) {
      return `nft add rule inet filter input ${action}`;
    }
    return `nft add rule inet filter input tcp dport ${rule.port} ${action}`;
  }

  // If port is "any", don't filter by port
  if (rule.port === "any" || !rule.port) {
    return `nft add rule inet filter input ${rule.protocol} ${action}`;
  }

  return `nft add rule inet filter input ${rule.protocol} dport ${rule.port} ${action}`;
}