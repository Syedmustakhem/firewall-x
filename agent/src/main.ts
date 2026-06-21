import { runDeployment }
from "./deployment/run-deployment.js";

async function start() {

  console.log(
    "FirewallX Agent Started"
  );

  setInterval(
    async () => {
      await runDeployment();
    },
    30000
  );

}

start();