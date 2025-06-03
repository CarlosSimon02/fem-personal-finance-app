import "dotenv/config";

import { runAllBudgetOperations } from "./budgetScripts";
import { runAllIncomeOperations } from "./incomeScripts";
import { runAllTransactionMigrations } from "./migrations/transactionMigrations";
import { runAllTransactionOperations } from "./transactionScripts";

/**
 * Master script to orchestrate all domain-specific operations
 * Provides a central entry point for running all scripts
 */

/**
 * Run all budget, income, and transaction operations
 */
export const runAllDataOperations = async (): Promise<void> => {
  try {
    console.log("🚀 Starting all data operations...");
    console.log("=".repeat(50));

    console.log("\n📊 Running budget operations...");
    await runAllBudgetOperations();

    console.log("\n💰 Running income operations...");
    await runAllIncomeOperations();

    console.log("\n💳 Running transaction operations...");
    await runAllTransactionOperations();

    console.log("\n✅ All data operations completed successfully!");
  } catch (error) {
    console.error("❌ Data operations failed:", error);
    throw error;
  }
};

/**
 * Run all migration operations
 */
export const runAllMigrations = async (): Promise<void> => {
  try {
    console.log("🔄 Starting all migration operations...");
    console.log("=".repeat(50));

    await runAllTransactionMigrations();

    console.log("\n✅ All migration operations completed successfully!");
  } catch (error) {
    console.error("❌ Migration operations failed:", error);
    throw error;
  }
};

/**
 * Run everything - data operations and migrations
 */
export const runEverything = async (): Promise<void> => {
  try {
    console.log("🎯 Starting ALL operations (data + migrations)...");
    console.log("=".repeat(60));

    await runAllDataOperations();

    console.log("\n" + "=".repeat(60));
    await runAllMigrations();

    console.log("\n🎉 ALL operations completed successfully!");
  } catch (error) {
    console.error("💥 Operations failed:", error);
    throw error;
  }
};

/**
 * Setup demo data (budgets + incomes only, no transactions)
 */
export const setupDemoData = async (): Promise<void> => {
  try {
    console.log("🎬 Setting up demo data...");
    console.log("=".repeat(40));

    console.log("\n📊 Creating demo budgets...");
    await runAllBudgetOperations();

    console.log("\n💰 Creating demo incomes...");
    await runAllIncomeOperations();

    console.log("\n✅ Demo data setup completed!");
    console.log(
      "ℹ️  You can now create transactions using the transaction scripts"
    );
  } catch (error) {
    console.error("❌ Demo data setup failed:", error);
    throw error;
  }
};

// Allow direct execution of this script
if (require.main === module) {
  const operation = process.argv[2];

  switch (operation) {
    case "data":
      runAllDataOperations();
      break;
    case "migrations":
      runAllMigrations();
      break;
    case "demo":
      setupDemoData();
      break;
    case "all":
      runEverything();
      break;
    default:
      console.log("Usage: tsx allScripts.ts [data|migrations|demo|all]");
      console.log("");
      console.log("Commands:");
      console.log(
        "  data       - Run all data operations (budgets, incomes, transactions)"
      );
      console.log("  migrations - Run all migration operations");
      console.log("  demo       - Setup demo data (budgets + incomes only)");
      console.log("  all        - Run everything (data + migrations)");
      console.log("");
      console.log("Individual scripts:");
      console.log("  tsx budgetScripts.ts [create|bulk|list|all]");
      console.log("  tsx incomeScripts.ts [create|bulk|all]");
      console.log("  tsx transactionScripts.ts [create|expense|income|all]");
      console.log(
        "  tsx migrations/transactionMigrations.ts [categories|signed-amounts|all]"
      );
  }
}
