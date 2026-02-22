import dotenv from "dotenv";
import path from "path";

const envFileMap = {
  development: ".env.development",
  production: ".env.production",
  test: ".env.development",
};

const NODE_ENV = process.env.NODE_ENV || "";
const file = envFileMap[NODE_ENV];
const envPath = path.resolve(process.cwd(), file);
console.log("path is ", envPath);
dotenv.config({ path: envPath });

const config = {
  env: NODE_ENV,
  port: process.env.PORT || 8080,
  db_url: process.env.DATABASE_URL || "",
};

export default config;
