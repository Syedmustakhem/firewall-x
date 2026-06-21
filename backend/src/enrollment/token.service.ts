import crypto from "crypto";

const token =
  "fwx_" +
  crypto
   .randomBytes(32)
   .toString("hex");