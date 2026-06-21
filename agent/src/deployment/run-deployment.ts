import { logStep } from "../reporter/log-reporting.js";

import { checkForDeployment } from "../deployment-worker/deployment-worker.service.js";

import { downloadConfig } from "../policy-sync/config-downloader.js";

import { compileRule } from "../compiler/rule-compiler.js";

import { executeCommand } from "../execution/command-executor.js";

import { validateRule }
from "../execution/command-validator.js";
import {
  reportSuccess,
  reportFailure
} from "../reporter/deployment-reporter.js";

export async function runDeployment() {
  try {

    const deployment = await checkForDeployment(
      "38b6a2bb-537b-4eb8-9316-64b1e272685e"
    );

    if (!deployment) {
      console.log("No pending deployment");
      return;
    }

    logStep("Deployment Found");

    const config = await downloadConfig(
      deployment.policy_id
    );

    console.log(
      "POLICY CONFIG:",
      JSON.stringify(config, null, 2)
    );

    logStep("Config Downloaded");

    for (const rule of config.rules) {

      const valid = validateRule(rule);

      if (!valid) {

        console.log(
          "Invalid Rule:",
          rule
        );

        continue;
      }

      const command = compileRule(rule);

      await executeCommand(command);
    }

    logStep("Rules Executed");

    await reportSuccess(
      deployment.id
    );

    logStep("Deployment Success");

  } catch (error: any) {

    console.error(
      "Deployment Error:",
      error
    );

    if (error?.deploymentId) {
      await reportFailure(
        error.deploymentId
      );
    }
  }
}