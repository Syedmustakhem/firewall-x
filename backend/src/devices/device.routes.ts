import { Router } from "express";
import { DeviceController } from "./device.controller.js";

const router = Router();
const deviceController = new DeviceController();

router.get("/", deviceController.getAll.bind(deviceController));
router.get("/:deviceId", deviceController.getOne.bind(deviceController));
router.post("/", deviceController.create.bind(deviceController));
router.post("/heartbeat", deviceController.heartbeat.bind(deviceController));
router.delete("/:deviceId", deviceController.delete.bind(deviceController));

export default router;