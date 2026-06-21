import express from "express";
import cors from "cors";
import helmet from "helmet";
import testRoutes from "./routes/test.routes.js";
import authRoutes from "./auth/auth.routes.js";
import userRoutes
from "./routes/user.routes.js";
import deviceRoutes
from "./devices/device.routes.js";
import policyRoutes
from "./policies/policy.routes.js";
import ruleRoutes
from "./rules/rule.routes.js";
import compilerRoutes
from "./compiler/compiler.routes.js";
import configRoutes
from "./configuration/config.routes.js";
import deploymentLogRoutes
from "./deployment-logs/deployment-log.routes.js";
import deploymentRoutes
from "./deployments/deployment.routes.js";
import policyAssignmentRoutes
from "./policy-assignments/policy-assignment.routes.js";
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use("/api", testRoutes);
app.use("/api/auth", authRoutes);
app.use(
 "/api/users",
 userRoutes
);
app.use(
 "/api/policies",
 policyRoutes
);
app.use(
 "/api/devices",
 deviceRoutes
);
app.use(
  "/api/rules",
  ruleRoutes
);
app.use(
  "/api/policy-assignments",
  policyAssignmentRoutes
);
app.use(
 "/api/compiler",
 compilerRoutes
);
app.use(
 "/api/config",
 configRoutes
);
app.use(
  "/api/deployments",
  deploymentRoutes
);
app.use(
  "/api/deployment-logs",
  deploymentLogRoutes
);
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "FirewallX API"
  });
});

export default app;