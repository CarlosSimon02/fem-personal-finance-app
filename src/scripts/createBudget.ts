import "dotenv/config";

import { CreateBudgetDto } from "@/core/schemas/budgetSchema";
import { createBudgetUseCase } from "@/factories/budget";

async function run() {
  try {
    const userId = process.env.TEST_USER_ID;

    if (!userId) {
      throw new Error("TEST_USER_ID environment variable is required");
    }

    const budgetData: CreateBudgetDto = {
      name: "Monthly Groceries",
      maximumSpending: 500,
      colorTag: "#4CAF50",
    };

    console.log(`Creating budget for user: ${userId}`);
    const result = await createBudgetUseCase.execute(userId, budgetData);

    console.log("Budget created successfully:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error creating budget:", error);
  }
}

run();
