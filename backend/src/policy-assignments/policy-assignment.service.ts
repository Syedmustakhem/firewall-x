import { randomUUID }
from "crypto";

import { PolicyAssignmentRepository }
from "./policy-assignment.repository.js";

const repository =
  new PolicyAssignmentRepository();

export class PolicyAssignmentService {

  assign(
    policyId: string,
    deviceId: string
  ) {

    const assignment = {
      id: randomUUID(),
      policyId,
      deviceId
    };

    return repository.create(
      assignment
    );
  }

  getAll() {
    return repository.findAll();
  }
}