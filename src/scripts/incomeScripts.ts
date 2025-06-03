import "dotenv/config";

import { CreateIncomeDto } from "@/core/schemas/incomeSchema";
import { createIncomeUseCase } from "@/factories/income";

/**
 * Consolidated income scripts for various income operations
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
 * Create a single income
 */
export const createSingleIncome = async (): Promise<void> => {
  try {
    const userId = validateUserId();

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
    throw error;
  }
};

/**
 * Create multiple incomes in bulk
 */
export const createBulkIncomes = async (): Promise<void> => {
  try {
    const userId = validateUserId();

    const incomesData: CreateIncomeDto[] = [
      { name: "Monthly Salary", colorTag: "#4CAF50" },
      { name: "Freelance Work", colorTag: "#2196F3" },
      { name: "Investment Dividends", colorTag: "#FFC107" },
      { name: "Rental Income", colorTag: "#9C27B0" },
      { name: "Side Business", colorTag: "#607D8B" },
      { name: "Bonus Payment", colorTag: "#00BCD4" },
      { name: "Consulting Fees", colorTag: "#795548" },
      { name: "Stock Gains", colorTag: "#8BC34A" },
      { name: "Online Sales", colorTag: "#E91E63" },
      { name: "Part-time Job", colorTag: "#3F51B5" },
      { name: "Royalties", colorTag: "#CDDC39" },
      { name: "Tax Refund", colorTag: "#009688" },
      { name: "Gifts Received", colorTag: "#673AB7" },
      { name: "Interest Income", colorTag: "#FF9800" },
      { name: "Commission", colorTag: "#F44336" },
      { name: "YouTube Earnings", colorTag: "#FF5722" },
      { name: "Blog Revenue", colorTag: "#03A9F4" },
      { name: "Affiliate Marketing", colorTag: "#4CAF50" },
      { name: "Pension", colorTag: "#9E9E9E" },
      { name: "Social Security", colorTag: "#00ACC1" },
      { name: "Alimony", colorTag: "#8D6E63" },
      { name: "Child Support", colorTag: "#7E57C2" },
      { name: "Lottery Winnings", colorTag: "#FF7043" },
      { name: "Garage Sale", colorTag: "#26A69A" },
      { name: "Tutoring Income", colorTag: "#D4E157" },
      { name: "Photography Gigs", colorTag: "#5C6BC0" },
      { name: "Music Lessons", colorTag: "#EC407A" },
      { name: "App Development", colorTag: "#66BB6A" },
      { name: "Ebook Sales", colorTag: "#AB47BC" },
      { name: "Podcast Sponsorship", colorTag: "#42A5F5" },
      { name: "Crypto Trading", colorTag: "#26C6DA" },
      { name: "Airbnb Hosting", colorTag: "#EF5350" },
      { name: "Car Sharing", colorTag: "#FFA726" },
      { name: "Survey Rewards", colorTag: "#78909C" },
      { name: "Focus Group", colorTag: "#7CB342" },
      { name: "Pet Sitting", colorTag: "#BA68C8" },
      { name: "House Sitting", colorTag: "#4DB6AC" },
      { name: "Translation Work", colorTag: "#FF8A65" },
      { name: "Graphic Design", colorTag: "#9575CD" },
      { name: "Web Development", colorTag: "#4DD0E1" },
      { name: "SEO Services", colorTag: "#81C784" },
      { name: "Social Media Management", colorTag: "#FFB74D" },
      { name: "Virtual Assistant", colorTag: "#A1887F" },
      { name: "Data Entry", colorTag: "#90A4AE" },
      { name: "Research Studies", colorTag: "#AED581" },
      { name: "Mystery Shopping", colorTag: "#F06292" },
      { name: "Product Testing", colorTag: "#4FC3F7" },
      { name: "Art Commissions", colorTag: "#FFD54F" },
      { name: "Craft Sales", colorTag: "#4DD0E1" },
      { name: "Farming Income", colorTag: "#81C784" },
    ];

    console.log(`Creating ${incomesData.length} incomes for user: ${userId}`);
    const result = await Promise.all(
      incomesData.map((income) => createIncomeUseCase.execute(userId, income))
    );

    console.log("Incomes created successfully:");
    console.log(`Created ${result.length} incomes`);
  } catch (error) {
    console.error("Error creating bulk incomes:", error);
    throw error;
  }
};

/**
 * Run all income operations
 */
export const runAllIncomeOperations = async (): Promise<void> => {
  try {
    console.log("Starting all income operations...");

    await createSingleIncome();
    await createBulkIncomes();

    console.log("All income operations completed successfully");
  } catch (error) {
    console.error("Income operations failed:", error);
    throw error;
  }
};

// Allow direct execution of this script
if (require.main === module) {
  const operation = process.argv[2];

  switch (operation) {
    case "create":
      createSingleIncome();
      break;
    case "bulk":
      createBulkIncomes();
      break;
    case "all":
      runAllIncomeOperations();
      break;
    default:
      console.log("Usage: tsx incomeScripts.ts [create|bulk|all]");
      console.log("  create - Create a single income");
      console.log("  bulk   - Create multiple incomes");
      console.log("  all    - Run all income operations");
  }
}
