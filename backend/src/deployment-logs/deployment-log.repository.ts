import { DeploymentLog }
from "./deployment-log.types.js";

const logs: DeploymentLog[] = [];

export class DeploymentLogRepository {

  create(log: DeploymentLog) {
    logs.push(log);
    return log;
  }

  findByDeployment(
    deploymentId: string
  ) {
    return logs.filter(
      l => l.deploymentId === deploymentId
    );
  }

}