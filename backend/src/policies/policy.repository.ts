import { db } from "../config/database.js";

export class PolicyRepository {

  async create(organizationId: string, name: string, description: string) {
    const result = await db.query(
      `INSERT INTO policies (organization_id, name, description)
       VALUES ($1, $2, $3) RETURNING *`,
      [organizationId, name, description]
    );
    return result.rows[0];
  }

  async getAll() {
    const result = await db.query(
      `SELECT * FROM policies ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async findById(policyId: string) {
    const result = await db.query(
      `SELECT * FROM policies WHERE id = $1`,
      [policyId]
    );
    return result.rows[0];
  }

  async delete(policyId: string) {
    await db.query(`DELETE FROM policies WHERE id = $1`, [policyId]);
  }

  async getRules(policyId: string) {
    const result = await db.query(
      `SELECT * FROM firewall_rules
       WHERE policy_id = $1 AND enabled = true
       ORDER BY priority ASC`,
      [policyId]
    );
    return result.rows;
  }

}