import { Router } from "express";
import * as walletController from "../controllers/wallet.js";
const router = Router();


router.get("/:id", walletController.getWallet);
router.get("/transactions/:id", walletController.getTransactions);
router.post("/transactions/:id", walletController.createTransaction);

export default router;
