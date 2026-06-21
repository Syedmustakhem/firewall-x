import { Request, Response } from "express";
import { DeviceService } from "./device.service.js";

export class DeviceController {
  private deviceService: DeviceService;

  constructor() {
    this.deviceService = new DeviceService();
  }

  async create(req: Request, res: Response) {
    try {
      const { name, hostname, ipAddress } = req.body;
      const organizationId = req.body.organizationId?.trim();

      const result = await this.deviceService.createDevice(
        organizationId, name, hostname, ipAddress
      );
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const result = await this.deviceService.getAllDevices();
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { deviceId } = req.params;
      const result = await this.deviceService.getDevice(deviceId);
      if (!result) return res.status(404).json({ message: "Device not found" });
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { deviceId } = req.params;
      await this.deviceService.deleteDevice(deviceId);
      return res.json({ message: "Device deleted" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async heartbeat(req: Request, res: Response) {
    try {
      const { deviceId } = req.body;
      const result = await this.deviceService.heartbeat(deviceId);
      return res.json({ message: "heartbeat received", device: result });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

}