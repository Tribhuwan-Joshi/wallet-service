import { Pool } from "pg";
import config from "./baseconfig.js";
console.log("config ", config);
const pool = new Pool({
  connectionString: config.db_url,
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false
  } : false
});

pool.on("connect", () => {
  console.log("Postgresql connecterd");
});

pool.on("error", (err) => {
  console.error("Unexpected DB error", err);
  process.exit(1);
});

export default pool;
