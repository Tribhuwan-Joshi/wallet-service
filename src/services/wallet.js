import AppError from "../utils/AppError.js";
import walletRepo from "../repositories/wallet.js";
import { getClient } from "./db.js";

const getWallet = async (userId) => {
  if (!userId) {
    throw new AppError("UserId is required", 400);
  }
  const walletInfo = await walletRepo.findWalletById(userId);
  return walletInfo;
};
const getTransactions = async (userId, page = 1, limit = 10) => {
  if (!userId) {
    throw new AppError("UserId is required", 400);
  }
  const offset = (page - 1) * limit;

  return walletRepo.getTransactionsByUserId(userId, limit, offset);

};

const createTransaction = async (userId, { type, amount },idempotenceKey) => {
  if (!userId) throw new AppError("UserId is required", 400);
  if (!type || !amount)
    throw new AppError("Invalid transaction data", 400);

  const client = await getClient();

  try {
    await client.query("BEGIN");
    const idempo = await walletRepo.insertIdempotencyKey(
      client,
      idempotenceKey
    );

    if (idempo.rowCount === 0) {
      throw new AppError("Duplicate request", 409);
    }
    const wallet = await walletRepo.lockWalletByUserId(client, userId);
    if (!wallet) throw new AppError("Wallet not found", 404);

    if (type === "Debit" && wallet.balance < amount) {
      throw new AppError("Insufficient balance", 400);
    }

    const transaction = await walletRepo.insertTransaction(
      client,
      wallet.id,
      type,
      amount
    );

    const systemWallet = await walletRepo.findSystemWallet();
    if (!systemWallet)
      throw new AppError("System wallet not configured", 500);

    if (type === "Debit") {
      await walletRepo.insertLedgerEntry(
        client,
        transaction.id,
        wallet.id,
        "DEBIT",
        amount
      );

      await walletRepo.insertLedgerEntry(
        client,
        transaction.id,
        systemWallet.id,
        "CREDIT",
        amount
      );

      await walletRepo.updateWalletBalance(
        client,
        wallet.id,
        -amount
      );
    } else {
      await walletRepo.insertLedgerEntry(
        client,
        transaction.id,
        wallet.id,
        "CREDIT",
        amount
      );

      await walletRepo.insertLedgerEntry(
        client,
        transaction.id,
        systemWallet.id,
        "DEBIT",
        amount
      );

      await walletRepo.updateWalletBalance(
        client,
        wallet.id,
        amount
      );
    }

    await client.query("COMMIT");

    return transaction;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export default { getWallet, getTransactions, createTransaction };
