import { DeviceRepository } from "./device.repository.js";

export class DeviceService {
  private deviceRepository: DeviceRepository;

  constructor() {
    this.deviceRepository = new DeviceRepository();
  }

  async createDevice(
    organizationId: string,
    name: string,
    hostname: string,
    ipAddress: string
  ) {
    return await this.deviceRepository.create(
      organizationId, name, hostname, ipAddress
    );
  }

  async getAllDevices() {
    return await this.deviceRepository.getAll();
  }

  async getDevice(deviceId: string) {
    return await this.deviceRepository.getOne(deviceId);
  }

  async deleteDevice(deviceId: string) {
    return await this.deviceRepository.delete(deviceId);
  }

  async heartbeat(deviceId: string) {
    return await this.deviceRepository.heartbeat(deviceId);
  }

}