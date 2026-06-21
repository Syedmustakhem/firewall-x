import {
  Request,
  Response
} from "express";

import { ConfigService }
from "./config.service.js";

const service =
  new ConfigService();

export class ConfigController {

  getConfig(
    req: Request,
    res: Response
  ) {

    const {
      deviceId
    } = req.params;

    const config =
      service.getDeviceConfig(
        deviceId
      );

    return res.json(config);

  }

}