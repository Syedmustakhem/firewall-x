import { Request, Response } from "express";
import { DeploymentLogService } from "./deployment-log.service.js";

const deploymentLogService =
  new DeploymentLogService();

export class DeploymentLogController {

  getLogs(
    req: Request,
    res: Response
  ) {

    const {
      deploymentId
    } = req.params;

    const logs =
      deploymentLogService.getLogs(
        deploymentId
      );

    return res.json(
      logs
    );

  }

}