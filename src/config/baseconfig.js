import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const envFileMap = {
  development: ".env.local",
  production: ".env.production",
  test: ".env.test",
};

const NODE_ENV = process.env.NODE_ENV || "development";
const file = envFileMap[NODE_ENV];
const envPath = path.resolve(process.cwd(), file);

dotenv.config({ path: envPath });

const config = {
  env: NODE_ENV,
  port: process.env.PORT || 8080,
};

export default config;
