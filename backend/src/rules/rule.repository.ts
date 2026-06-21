import { db } from "../config/database.js";

export class RuleRepository {

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
    const result = await db.query(
      `INSERT INTO firewall_rules
       (policy_id, name, source, destination, protocol, port, action, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [policyId, name, source, destination, protocol, port, action, priority]
    );
    return result.rows[0];
  }

  async getAll() {
    const result = await db.query(
      `SELECT * FROM firewall_rules ORDER BY priority ASC`
    );
    return result.rows;
  }

  async getByPolicyId(policyId: string) {
    const result = await db.query(
      `SELECT * FROM firewall_rules
       WHERE policy_id = $1
       ORDER BY priority ASC`,
      [policyId]
    );
    return result.rows;
  }

  async delete(ruleId: string) {
    await db.query(
      `DELETE FROM firewall_rules WHERE id = $1`,
      [ruleId]
    );
  }

}