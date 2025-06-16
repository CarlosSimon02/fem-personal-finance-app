import { adminFirestore } from "@/services/firebase/firebaseAdmin";

export type CollectionName =
  | "budgets"
  | "incomes"
  | "transactions"
  | "categories"
  | "pots";

export class CollectionService {
  getUserCollection() {
    return adminFirestore.collection("users");
  }

  getCollection(userId: string, collectionName: CollectionName) {
    return this.getUserCollection().doc(userId).collection(collectionName);
  }

  getBudgetCollection(userId: string) {
    return this.getCollection(userId, "budgets");
  }

  getIncomeCollection(userId: string) {
    return this.getCollection(userId, "incomes");
  }

  getTransactionCollection(userId: string) {
    return this.getCollection(userId, "transactions");
  }

  getCategoryCollection(userId: string) {
    return this.getCollection(userId, "categories");
  }

  getPotCollection(userId: string) {
    return this.getCollection(userId, "pots");
  }
}
