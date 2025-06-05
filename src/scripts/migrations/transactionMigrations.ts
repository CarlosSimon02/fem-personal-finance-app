import "dotenv/config";

import { TransactionMigrationService } from "@/data/services/TransactionMigrationService";
import { debugLog } from "@/utils/debugLog";

/**
 * Standalone migration script for transaction-related data migrations
 * Can be run independently without requiring the full TransactionRepository
 */

const migrationService = new TransactionMigrationService();

/**
 * Run all transaction migrations
 */
export const runAllTransactionMigrations = async (): Promise<void> => {
  try {
    debugLog("TransactionMigrations", "Starting all transaction migrations...");

    await migrationService.migrateTransactionCategoriesToCollection();
    await migrationService.migrateTransactionAmountsToSignedAmounts();
    await migrationService.synchronizeCategoriesWithTransactions();

    debugLog(
      "TransactionMigrations",
      "All transaction migrations completed successfully"
    );
  } catch (error) {
    const err = error as Error;
    debugLog("TransactionMigrations", `Migration failed: ${err.message}`, err);
    throw error;
  }
};

/**
 * Run specific migration: Categories to Collection
 */
export const runCategoryMigration = async (): Promise<void> => {
  try {
    debugLog("TransactionMigrations", "Starting category migration...");
    await migrationService.migrateTransactionCategoriesToCollection();
    debugLog(
      "TransactionMigrations",
      "Category migration completed successfully"
    );
  } catch (error) {
    const err = error as Error;
    debugLog(
      "TransactionMigrations",
      `Category migration failed: ${err.message}`,
      err
    );
    throw error;
  }
};

/**
 * Run specific migration: Amounts to Signed Amounts
 */
export const runSignedAmountMigration = async (): Promise<void> => {
  try {
    debugLog("TransactionMigrations", "Starting signed amount migration...");
    await migrationService.migrateTransactionAmountsToSignedAmounts();
    debugLog(
      "TransactionMigrations",
      "Signed amount migration completed successfully"
    );
  } catch (error) {
    const err = error as Error;
    debugLog(
      "TransactionMigrations",
      `Signed amount migration failed: ${err.message}`,
      err
    );
    throw error;
  }
};

/**
 * Run specific migration: Synchronize Categories with Transactions
 */
export const runCategorySynchronization = async (): Promise<void> => {
  try {
    debugLog("TransactionMigrations", "Starting category synchronization...");
    await migrationService.synchronizeCategoriesWithTransactions();
    debugLog(
      "TransactionMigrations",
      "Category synchronization completed successfully"
    );
  } catch (error) {
    const err = error as Error;
    debugLog(
      "TransactionMigrations",
      `Category synchronization failed: ${err.message}`,
      err
    );
    throw error;
  }
};

// Allow direct execution of this script
if (require.main === module) {
  const migrationName = process.argv[2];

  switch (migrationName) {
    case "all":
      runAllTransactionMigrations();
      break;
    case "categories":
      runCategoryMigration();
      break;
    case "signed-amounts":
      runSignedAmountMigration();
      break;
    case "sync-categories":
      runCategorySynchronization();
      break;
    default:
      console.log(
        "Usage: tsx transactionMigrations.ts [all|categories|signed-amounts|sync-categories]"
      );
      console.log("  all            - Run all transaction migrations");
      console.log("  categories     - Run category extraction migration");
      console.log("  signed-amounts - Run signed amount migration");
      console.log(
        "  sync-categories - Run category synchronization (remove orphaned categories)"
      );
  }
}
