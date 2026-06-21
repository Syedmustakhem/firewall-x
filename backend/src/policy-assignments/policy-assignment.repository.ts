import { PolicyAssignment }
from "./policy-assignment.types.js";

const assignments: PolicyAssignment[] = [];

export class PolicyAssignmentRepository {

  create(
    assignment: PolicyAssignment
  ) {
    assignments.push(assignment);
    return assignment;
  }

  findByDeviceId(
    deviceId: string
  ) {
    return assignments.filter(
      a => a.deviceId === deviceId
    );
  }

  findAll() {
    return assignments;
  }
}