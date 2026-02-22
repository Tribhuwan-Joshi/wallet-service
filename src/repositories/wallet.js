import { query } from "../services/db.js"

const findWalletById = async (userId) => {
    const { rows } = await query(`SELECT * FROM wallets WHERE user_id = $1`, [userId]);
    return rows[0] || null;
}

const findSystemWallet = async () => {
    const { rows } = await query(`SELECT * from wallets where wallet_type = 'SYSTEM' LIMIT 1`);
    return rows[0] || null;
}

const getTransactionsByUserId = async (
    userId,
    limit = 10,
    offset = 0
) => {
    const { rows } = await query(
        `SELECT t.*
     FROM transactions t
     JOIN wallets w ON t.wallet_id = w.id
     WHERE w.user_id = $1
     ORDER BY t.created_at DESC
     LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
    );

    return rows;
};

const lockWalletByUserId = async (client, userId) => {
    const { rows } = await client.query(`SELECT * FROM wallets where user_id = $1 FOR UPDATE`, [userId]);
    return rows[0] || null;
}

const insertTransaction = async (client, walletId, type, amount) => {
    const { rows } = await client.query(`INSERT INTO transactions (wallet_id, type, amount) VALUES ($1, $2, $3) RETURNING *`, [walletId, type, amount]);
    return rows[0];
}

const insertLedgerEntry = async (client,
    transactionId,
    walletId,
    entryType,
    amount) => {
    await client.query(
        `INSERT INTO ledger_entries (transaction_id, wallet_id, entry_type, amount)
     VALUES ($1, $2, $3, $4)`,
        [transactionId, walletId, entryType, amount]
    );
}

const updateWalletBalance = async (client, walletId, changeAmount) => {
    await client.query(`UPDATE wallets SET balance = balance + $1 WHERE id = $2`, [changeAmount, walletId]);
}

export const insertIdempotencyKey = async (
    client,
    key
) => {
    return client.query(
        `INSERT INTO idempotency_keys (idempotency_key)
     VALUES ($1)
     ON CONFLICT (idempotency_key)
     DO NOTHING
     RETURNING id`,
        [key]
    );
};

export default {insertIdempotencyKey, findWalletById, updateWalletBalance, insertLedgerEntry, insertTransaction, lockWalletByUserId, getTransactionsByUserId, findSystemWallet };