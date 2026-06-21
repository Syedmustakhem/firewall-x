import { PolicyAssignmentRepository }
from "../policy-assignments/policy-assignment.repository.js";

import { CompilerService }
from "../compiler/compiler.service.js";

const assignmentRepo =
  new PolicyAssignmentRepository();

const compilerService =
  new CompilerService();

export class ConfigService {

  getDeviceConfig(
    deviceId: string
  ) {

    const assignment =
      assignmentRepo.findByDeviceId(
        deviceId
      );

    if (!assignment) {
      return {
        commands: []
      };
    }

    const commands =
      compilerService.compilePolicy(
        assignment.policyId
      );

    return {
      deviceId,
      policyId:
        assignment.policyId,
      commands
    };

  }

}