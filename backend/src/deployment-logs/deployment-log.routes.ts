import { Router } from "express";

import {
  DeploymentLogController
} from "./deployment-log.controller.js";

const router = Router();

const controller =
  new DeploymentLogController();

router.get(
  "/:deploymentId",
  controller.getLogs.bind(
    controller
  )
);

export default router;