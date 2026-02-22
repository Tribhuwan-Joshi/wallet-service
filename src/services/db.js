import pool from "../config/dbconfig.js";

export const query = (text, params) => {
  return pool.query(text, params);
};

export const getClient = () => pool.connect();
