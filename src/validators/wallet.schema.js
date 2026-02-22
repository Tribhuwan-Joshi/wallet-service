import * as z from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["Topup", "Bonus", "Credit", "Debit"]),
  amount: z.number().positive("Amount must be greater than 0"),
});

export const idempotencySchema = z.uuidv4("Provide a valid idempotency key");