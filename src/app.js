import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import walletRouter from "./routes/wallet.js";
import userRouter from "./routes/user.js";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.js";
import * as userService from "./services/user.js";
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
});
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(limiter);
app.use(express.json());
app.use(helmet());
app.get("/", (req, res) => {
  res.send(`This a wallet service, please use the exposed endpoints to proceed.`);
})
app.use("/wallet", walletRouter);
app.use("/user", userRouter);
app.use(errorHandler);

export default app;
