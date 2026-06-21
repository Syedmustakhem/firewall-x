import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,

  NODE_ENV: process.env.NODE_ENV || "development",

  JWT_SECRET:
    process.env.JWT_SECRET || "default-secret",

  DB_HOST: process.env.DB_HOST || "localhost",

  DB_PORT: Number(process.env.DB_PORT) || 5432,

  DB_NAME: process.env.DB_NAME || "firewallx",

  DB_USER: process.env.DB_USER || "postgres",

  DB_PASSWORD: process.env.DB_PASSWORD || ""
};