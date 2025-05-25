import {
  ALGOLIA_BUDGETS_INDEX,
  ALGOLIA_INCOMES_INDEX,
  ALGOLIA_TRANSACTIONS_INDEX,
  algoliaClient,
} from "@/services/algolia";

async function run() {
  try {
    const transactionsResponse = await algoliaClient.setSettings({
      indexName: ALGOLIA_TRANSACTIONS_INDEX,
      indexSettings: {
        attributesForFaceting: ["filterOnly(category.id)"],
      },
    });

    console.log("Transactions Index settings updated:", transactionsResponse);

    const budgetsResponse = await algoliaClient.setSettings({
      indexName: ALGOLIA_BUDGETS_INDEX,
      indexSettings: {
        attributesForFaceting: ["filterOnly(category.id)"],
      },
    });

    console.log("Budgets Index settings updated:", budgetsResponse);

    const incomesResponse = await algoliaClient.setSettings({
      indexName: ALGOLIA_INCOMES_INDEX,
      indexSettings: {
        attributesForFaceting: ["filterOnly(category.id)"],
      },
    });

    console.log("Incomes Index settings updated:", incomesResponse);
  } catch (error) {
    console.error("Error updating index settings:", error);
  }
}

run();
