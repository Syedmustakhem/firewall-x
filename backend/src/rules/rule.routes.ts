import { Router } from "express";
import { RuleController } from "./rule.controller.js";

const router = Router();
const controller = new RuleController();

router.get("/", controller.getAll.bind(controller));
router.post("/", controller.create.bind(controller));
router.delete("/:ruleId", controller.delete.bind(controller));

export default router;