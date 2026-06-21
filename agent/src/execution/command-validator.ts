export function validateRule(rule: any): boolean {
  const protocols = ["tcp", "udp", "icmp", "any"];

  if (!protocols.includes(rule.protocol)) {
    return false;
  }

  // Allow "any" as a valid port
  if (rule.port === "any" || rule.port === "*") {
    return true;
  }

  // Handle port ranges like "80-443"
  if (String(rule.port).includes("-")) {
    const [from, to] = String(rule.port).split("-").map(Number);
    return !isNaN(from) && !isNaN(to) && from >= 1 && to <= 65535;
  }

  const port = Number(rule.port);

  if (isNaN(port)) return false;
  if (port < 1 || port > 65535) return false;

  return true;
}