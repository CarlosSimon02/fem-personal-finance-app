import "dotenv/config";

import { CreateTransactionDto } from "@/core/schemas/transactionSchema";
import { createTransactionUseCase } from "@/factories/transaction";

async function run() {
  try {
    const userId = process.env.TEST_USER_ID;

    if (!userId) {
      throw new Error("TEST_USER_ID environment variable is required");
    }

    const transactionData: CreateTransactionDto = {
      name: "Monthly Groceries",
      type: "expense",
      amount: 500,
      recipientOrPayer: "John Doe",
      transactionDate: new Date(),
      description: "Monthly Groceries",
      emoji: "🍎",
      categoryId: "2f6jLgt12F",
    };

    console.log(`Creating transaction for user: ${userId}`);
    const result = await createTransactionUseCase.execute(
      userId,
      transactionData
    );

    console.log("Transaction created successfully:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error creating transaction:", error);
  }
}

run();
