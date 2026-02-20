import express from "express";
import { rateLimit } from 'express-rate-limit';
import walletRouter from "./   "

const app = express();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, 
})

app.use(limiter)
app.use(express.json());
app.use(helmet());
app.use("/wallet",walletRouter);



export default app;
