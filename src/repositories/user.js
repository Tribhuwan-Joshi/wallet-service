import { query } from "../services/db.js";

export const createUserWithWallet = async (client, email) => {
  const userRes = await client.query(
    `INSERT INTO users (email)
     VALUES ($1)
     RETURNING id, email, created_at`,
    [email]
  );

  const user = userRes.rows[0];

  const walletRes = await client.query(
    `INSERT INTO wallets (user_id)
     VALUES ($1)
     RETURNING id, balance, created_at`,
    [user.id]
  );

  const wallet = walletRes.rows[0];

  return {
    ...user,
    wallet,
  };
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

// here just for testing, not for prod.
const getAllUsers = async () => {
    const { rows } = await query(`SELECT * FROM users`);
    return rows;
}


export default { findUserById, createUserWithWallet, getAllUsers }