import { Router } from "express";
import { PolicyController } from "./policy.controller.js";

const router = Router();
const policyController = new PolicyController();

router.get("/", policyController.getAll.bind(policyController));
router.get("/:policyId", policyController.getOne.bind(policyController));
router.get("/:policyId/config", policyController.getConfig.bind(policyController));
router.post("/", policyController.create.bind(policyController));
router.delete("/:policyId", policyController.delete.bind(policyController));

export default router;