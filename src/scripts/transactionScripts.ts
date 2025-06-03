import "dotenv/config";

import { CreateTransactionDto } from "@/core/schemas/transactionSchema";
import { createTransactionUseCase } from "@/factories/transaction";

/**
 * Consolidated transaction scripts for various transaction operations
 * Can be run independently with different commands
 */

const validateUserId = (): string => {
  const userId = process.env.TEST_USER_ID;
  if (!userId) {
    throw new Error("TEST_USER_ID environment variable is required");
  }
  return userId;
};

/**
 * Create a single transaction
 */
export const createSingleTransaction = async (): Promise<void> => {
  try {
    const userId = validateUserId();

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
    throw error;
  }
};

/**
 * Create sample expense transaction
 */
export const createExpenseTransaction = async (): Promise<void> => {
  try {
    const userId = validateUserId();

    const expenseData: CreateTransactionDto = {
      name: "Coffee Shop",
      type: "expense",
      amount: 15.5,
      recipientOrPayer: "Starbucks",
      transactionDate: new Date(),
      description: "Morning coffee and pastry",
      emoji: "☕",
      categoryId: "2f6jLgt12F",
    };

    console.log(`Creating expense transaction for user: ${userId}`);
    const result = await createTransactionUseCase.execute(userId, expenseData);

    console.log("Expense transaction created successfully:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error creating expense transaction:", error);
    throw error;
  }
};

/**
 * Create sample income transaction
 */
export const createIncomeTransaction = async (): Promise<void> => {
  try {
    const userId = validateUserId();

    const incomeData: CreateTransactionDto = {
      name: "Freelance Payment",
      type: "income",
      amount: 1200,
      recipientOrPayer: "Tech Corp",
      transactionDate: new Date(),
      description: "Web development project payment",
      emoji: "💰",
      categoryId: "2f6jLgt12F",
    };

    console.log(`Creating income transaction for user: ${userId}`);
    const result = await createTransactionUseCase.execute(userId, incomeData);

    console.log("Income transaction created successfully:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error creating income transaction:", error);
    throw error;
  }
};

/**
 * Run all transaction operations
 */
export const runAllTransactionOperations = async (): Promise<void> => {
  try {
    console.log("Starting all transaction operations...");

    await createSingleTransaction();
    await createExpenseTransaction();
    await createIncomeTransaction();

    console.log("All transaction operations completed successfully");
  } catch (error) {
    console.error("Transaction operations failed:", error);
    throw error;
  }
};

// Allow direct execution of this script
if (require.main === module) {
  const operation = process.argv[2];

  switch (operation) {
    case "create":
      createSingleTransaction();
      break;
    case "expense":
      createExpenseTransaction();
      break;
    case "income":
      createIncomeTransaction();
      break;
    case "all":
      runAllTransactionOperations();
      break;
    default:
      console.log(
        "Usage: tsx transactionScripts.ts [create|expense|income|all]"
      );
      console.log("  create  - Create a sample transaction");
      console.log("  expense - Create a sample expense transaction");
      console.log("  income  - Create a sample income transaction");
      console.log("  all     - Run all transaction operations");
  }
}
