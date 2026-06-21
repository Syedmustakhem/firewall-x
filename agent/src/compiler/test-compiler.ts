import {
  compileRule
}
from "./rule-compiler.js";

const command =
  compileRule({
    protocol: "tcp",
    port: "443",
    action: "allow"
  });

console.log(command);