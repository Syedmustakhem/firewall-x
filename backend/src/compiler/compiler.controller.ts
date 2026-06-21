import {
  Request,
  Response
} from "express";

import { CompilerService }
from "./compiler.service.js";

const compilerService =
  new CompilerService();

export class CompilerController {

  compile(
    req: Request,
    res: Response
  ) {

    const { policyId } =
      req.params;

    const commands =
      compilerService.compilePolicy(
        policyId
      );

    return res.json({
      commands
    });

  }

}