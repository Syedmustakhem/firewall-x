import pkg from "pg";
import { env } from "./env.js";

const { Pool } = pkg;

export const db = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD
});