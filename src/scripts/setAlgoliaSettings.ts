import { ALGOLIA_TRANSACTIONS_INDEX, algoliaClient } from "@/services/algolia";

async function run() {
  try {
    const response = await algoliaClient.setSettings({
      indexName: ALGOLIA_TRANSACTIONS_INDEX,
      indexSettings: {
        attributesForFaceting: ["filterOnly(category.id)"],
      },
    });
    console.log("Index settings updated:", response);
  } catch (error) {
    console.error("Error updating index settings:", error);
  }
}

run();
