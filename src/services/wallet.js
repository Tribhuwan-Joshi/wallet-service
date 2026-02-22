import AppError from "../utils/AppError.js";
import walletRepo from "../repositories/wallet.js";

const getWallet = async (userId) => {
  if (!userId) {
    throw new AppError("UserId is required", 400);
  }
  const walletInfo = await walletRepo.findWalletById(userId);
  return walletInfo;
};
const getTransactions = async (userId) => {
  if (!userId) {
    throw new AppError("UserId is required", 400);
  }
  const transactions = await dbService.getTransactions(userId);
  return transactions;
};

const createTransaction = async (userId, transactionInfo) => {
  if (!userId) {
    throw new AppError("UserId is required", 400);
  }
  if (!transactionInfo) {
    throw new AppError("Transaction body is required", 400);
  }
};

export default { getWallet, getTransactions, createTransaction };
