import walletService from "../services/wallet.js";
import AppError from "../utils/AppError.js";
import {
  createTransactionSchema,
  idempotencySchema,
} from "../validators/wallet.schema.js";

const getWallet = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const walletInfo = await walletService.getWallet(userId);
    console.log("wallet info is ", walletInfo);
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
    const parseKey = idempotencySchema.safeParse(
      req.headers["idempotency-key"]
    );
    if (!parseRes.success) {
      throw new AppError(parseRes.error.message, 400);
    }
    if (!parseKey.success) throw new AppError(parseKey.error.message, 400);
    const idempotenceKey = parseKey.data;
    const { type, amount } = parseRes.data;
    const response = await walletService.createTransaction(
      userId,
      {
        type,
        amount,
      },
      idempotenceKey,
    );
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export { getWallet, getTransactions, createTransaction };
