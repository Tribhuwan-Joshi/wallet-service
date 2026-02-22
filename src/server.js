import config from "./config/baseconfig.js";
import app from "./app.js";
import pool from "./config/dbconfig.js";

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("DB ready");
    app.listen(config.port, () =>
      console.log(`Server running at PORT ${config.port}`),
    );
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
}

startServer();
