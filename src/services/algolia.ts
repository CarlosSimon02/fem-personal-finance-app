import { env } from "@/config/env";
import { algoliasearch } from "algoliasearch";

export const algoliaClient = algoliasearch(
  env.ALGOLIA_APP_ID,
  env.ALGOLIA_API_KEY
);

export const ALGOLIA_TRANSACTIONS_INDEX = "transactions";
export const ALGOLIA_BUDGETS_INDEX = "budgets";
export const ALGOLIA_INCOMES_INDEX = "income";
