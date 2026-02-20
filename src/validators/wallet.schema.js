import * as z from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["Topup", "Bonus", "Credit", "Debit"]),
  amount: z.number().positive("Amount must be greater than 0"),
});
