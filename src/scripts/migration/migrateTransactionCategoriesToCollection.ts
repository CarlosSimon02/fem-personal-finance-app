import "dotenv/config";

import { TransactionRepository } from "@/data/repositories/transactionRepository";

async function run() {
  try {
    const transactionRepository = new TransactionRepository();

    console.log(`Migrating transaction categories to collection`);
    await transactionRepository.migrateTransactionCategoriesToCollection();
  } catch (error) {
    console.error("Error migrating transaction categories:", error);
  }
}

run();
