import {
  Request,
  Response
} from "express";

import { PolicyAssignmentService }
from "./policy-assignment.service.js";

const service =
  new PolicyAssignmentService();

export class PolicyAssignmentController {

  assign(
    req: Request,
    res: Response
  ) {

    const {
      policyId,
      deviceId
    } = req.body;

    const result =
      service.assign(
        policyId,
        deviceId
      );

    return res
      .status(201)
      .json(result);
  }

  getAll(
    req: Request,
    res: Response
  ) {

    return res.json(
      service.getAll()
    );
  }
}