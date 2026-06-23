import { Router }
from "express";

import {
 TelemetryController
}
from "./telemetry.controller.js";

const router = Router();

const controller =
 new TelemetryController();

router.post(
 "/heartbeat",
 controller.heartbeat
);

export default router;