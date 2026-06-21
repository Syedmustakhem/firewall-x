import { Router }
from "express";

import {
  ConfigController
}
from "./config.controller.js";

const router = Router();

const controller =
  new ConfigController();

router.get(
  "/:deviceId",
  controller.getConfig.bind(
    controller
  )
);

export default router;