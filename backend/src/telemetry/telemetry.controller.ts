import { Request, Response }
from "express";

import { TelemetryService }
from "./telemetry.service.js";

const service = new TelemetryService();

export class TelemetryController {

 async heartbeat(
   req: Request,
   res: Response
 ) {

   const result =
     await service.heartbeat(req.body);

   res.json(result);

 }

}