export interface CreateDeviceDto {
  name: string;
  hostname: string;
}

export interface Device {
  id: string;
  name: string;
  hostname: string;
  status: string;
}
