import { db } from "../config/database.js";

export class TelemetryRepository {

  async saveHeartbeat(
    deviceId: string,
    cpu: number,
    memory: number,
    disk: number
  ) {

    const result = await db.query(
      `
      INSERT INTO telemetry
      (
        device_id,
        cpu_usage,
        memory_usage,
        disk_usage
      )
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [
        deviceId,
        cpu,
        memory,
        disk
      ]
    );

    return result.rows[0];
  }

}