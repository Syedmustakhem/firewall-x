export interface Rule {
  id: string;
  policyId: string;
  name: string;
  protocol: string;
  port: number;
  action: "allow" | "deny";
}