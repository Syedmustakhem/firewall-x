import { db } from "../config/database.js";

export class DeploymentRepository {

  async create(deviceId: string, policyId: string) {
    const result = await db.query(
      `INSERT INTO deployments (device_id, policy_id, status)
       VALUES ($1, $2, 'pending') RETURNING *`,
      [deviceId, policyId]
    );
    return result.rows[0];
  }

  async getAll() {
    const result = await db.query(
      `SELECT * FROM deployments ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async findPendingByDevice(deviceId: string) {
    const result = await db.query(
      `SELECT * FROM deployments
       WHERE device_id = $1 AND status = 'pending'
       LIMIT 1`,
      [deviceId]
    );
    return result.rows[0];
  }

  async updateStatus(deploymentId: string, status: string) {
    const result = await db.query(
      `UPDATE deployments SET status = $2, deployed_at = NOW()
       WHERE id = $1 RETURNING *`,
      [deploymentId, status]
    );
    return result.rows[0];
  }

}