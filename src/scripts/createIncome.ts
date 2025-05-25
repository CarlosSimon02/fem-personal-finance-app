import "dotenv/config";

import { CreateIncomeDto } from "@/core/schemas/incomeSchema";
import { createIncomeUseCase } from "@/factories/income";

async function run() {
  try {
    const userId = process.env.TEST_USER_ID;

    if (!userId) {
      throw new Error("TEST_USER_ID environment variable is required");
    }

    const incomeData: CreateIncomeDto = {
      name: "Monthly Salary",
      colorTag: "#4CAF50",
    };

    console.log(`Creating income for user: ${userId}`);
    const result = await createIncomeUseCase.execute(userId, incomeData);

    console.log("Income created successfully:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error creating income:", error);
  }
}

run();
