import { Router }
from "express";

import {
  CompilerController
}
from "./compiler.controller.js";

const router = Router();

const controller =
  new CompilerController();

router.get(
  "/compile/:policyId",
  controller.compile.bind(
    controller
  )
);

export default router;