import "dotenv/config";

import { getPaginatedBudgetsUseCase } from "@/factories/budget";

async function run() {
  try {
    // Replace with an actual user ID for testing
    const userId = process.env.TEST_USER_ID;

    if (!userId) {
      throw new Error("TEST_USER_ID environment variable is required");
    }

    console.log(`Getting paginated budgets for user: ${userId}`);
    const result = await getPaginatedBudgetsUseCase.execute(userId, {
      filters: [],
      pagination: { page: 1, limitPerPage: 10 },
      sort: { field: "createdAt", order: "desc" },
      search: "Gro",
    });

    console.log("Budgets fetched successfully:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error fetching budgets:", error);
  }
}

run();
