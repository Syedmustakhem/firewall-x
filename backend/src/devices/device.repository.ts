import { db } from "../config/database.js";

export class DeviceRepository {

  async create(
    organizationId: string,
    name: string,
    hostname: string,
    ipAddress: string
  ) {
    const result = await db.query(
      `INSERT INTO devices (organization_id, name, hostname, ip_address)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [organizationId, name, hostname, ipAddress]
    );
    return result.rows[0];
  }

  async getAll() {
    const result = await db.query(
      `SELECT * FROM devices ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async getOne(deviceId: string) {
    const result = await db.query(
      `SELECT * FROM devices WHERE id = $1`,
      [deviceId]
    );
    return result.rows[0];
  }

  async delete(deviceId: string) {
    await db.query(`DELETE FROM devices WHERE id = $1`, [deviceId]);
  }

  async heartbeat(deviceId: string) {
    const result = await db.query(
      `UPDATE devices SET status = 'online', last_seen = NOW()
       WHERE id = $1 RETURNING *`,
      [deviceId]
    );
    return result.rows[0];
  }

}