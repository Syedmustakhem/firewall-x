import { Router } from "express";
import { DeploymentController } from "./deployment.controller.js";

const router = Router();
const controller = new DeploymentController();

router.get("/", controller.getAll.bind(controller));
router.post("/", controller.create.bind(controller));
router.get("/pending/:deviceId", controller.getPending.bind(controller));
router.patch("/:deploymentId/status", controller.updateStatus.bind(controller));

export default router;