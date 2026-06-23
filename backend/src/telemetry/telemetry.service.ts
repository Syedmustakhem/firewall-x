import { TelemetryRepository }
from "./telemetry.repository.js";

const repo = new TelemetryRepository();

export class TelemetryService {

 async heartbeat(data:any){

   return repo.saveHeartbeat(
     data.deviceId,
     data.cpu,
     data.ram,
     data.disk
   );

 }

}