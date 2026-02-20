import  walletService from "../services/wallet.js";

const getWallet = async (req, res,next) => {
  const userId = req.params.id;

  try {
    const walletInfo = await walletService.getWallet(userId);
    res.status(200).json(walletInfo);
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res,next) => {
  const userId = req.params.id;
  try {
    const transactions = await walletService.getTransactions(userId);
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res,next) => {
  const userId = req.params.id;
  const { type, amount } = req.body;
  try {
    const response = await walletService.createTransaction(userId, {
      type,
      amount,
    });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export default { getWallet, getTransactions, createTransaction };
