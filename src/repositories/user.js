import { query } from "../services/db.js";

const createUser = async (email) => {
    const { rows } = await query(
        `INSERT INTO users (email)
     VALUES ($1)
     RETURNING id, email, created_at`,
        [email]
    );
    return rows[0];
};

const findUserById = async (id) => {
    const { rows } = await query(
        `SELECT id, email, created_at
     FROM users
     WHERE id = $1`,
        [id]
    );
    return rows[0] || null;
};



export default { findUserById, createUser }