import "dotenv/config";

import { TransactionRepository } from "@/data/repositories/transactionRepository";

async function run() {
  try {
    const transactionRepository = new TransactionRepository();

    console.log(`Migrating transaction amounts to signed amounts`);
    await transactionRepository.migrateTransactionAmountsToSignedAmounts();
  } catch (error) {
    console.error("Error migrating transaction amounts:", error);
  }
}

run();
