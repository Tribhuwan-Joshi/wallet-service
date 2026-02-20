import walletService from "../services/wallet.js";
import AppError from "../utils/AppError.js";
import { createTransactionSchema } from "../validators/wallet.schema.js";

const getWallet = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const walletInfo = await walletService.getWallet(userId);
    res.status(200).json(walletInfo);
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const transactions = await walletService.getTransactions(userId);
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const parseRes = createTransactionSchema.safeParse(req.body);
    if (!parseRes.success) {
      throw new AppError(parseRes.error, 400);
    }
    const { type, amount } = parseRes.data;
    const response = await walletService.createTransaction(userId, {
      type,
      amount,
    });
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export default { getWallet, getTransactions, createTransaction };
