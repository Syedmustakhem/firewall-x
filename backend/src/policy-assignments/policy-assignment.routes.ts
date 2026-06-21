import { Router }
from "express";

import { PolicyAssignmentController }
from "./policy-assignment.controller.js";

const router = Router();

const controller =
  new PolicyAssignmentController();

router.post(
  "/",
  controller.assign.bind(
    controller
  )
);

router.get(
  "/",
  controller.getAll.bind(
    controller
  )
);

export default router;