import { randomUUID }
from "crypto";

import {
  DeploymentLogRepository
}
from "./deployment-log.repository.js";

const repository =
  new DeploymentLogRepository();

export class DeploymentLogService {

  create(
    deploymentId: string,
    message: string
  ) {

    return repository.create({
      id: randomUUID(),
      deploymentId,
      message,
      createdAt: new Date()
    });

  }

  getLogs(
    deploymentId: string
  ) {

    return repository.findByDeployment(
      deploymentId
    );

  }

}