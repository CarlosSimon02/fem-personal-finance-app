import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import {
  TransactionCategory,
  TransactionType,
} from "@/core/schemas/transactionSchema";
import { FieldValue } from "firebase-admin/firestore";
import { BudgetRepository } from "../BudgetRepository";
import { IncomeRepository } from "../IncomeRepository";
import { CollectionService } from "./CollectionService";

export class CategoryService {
  private collectionService: CollectionService;
  private incomeRepository: IIncomeRepository;
  private budgetRepository: IBudgetRepository;

  constructor() {
    this.collectionService = new CollectionService();
    this.incomeRepository = new IncomeRepository();
    this.budgetRepository = new BudgetRepository();
  }

  async getCategory(
    userId: string,
    categoryId: string,
    type: TransactionType
  ): Promise<TransactionCategory> {
    if (type === "income") {
      const income = await this.incomeRepository.getIncome(userId, categoryId);
      if (!income) {
        throw new Error("Category ID not found");
      }
      return income;
    } else {
      const budget = await this.budgetRepository.getBudget(userId, categoryId);
      if (!budget) {
        throw new Error("Category ID not found");
      }
      return budget;
    }
  }

  async createCategoryIfNotExists(
    userId: string,
    category: TransactionCategory,
    batch: FirebaseFirestore.WriteBatch
  ): Promise<void> {
    const categoryRef = this.collectionService
      .getCategoryCollection(userId)
      .doc(category.id);
    const existingCategory = await categoryRef.get();

    if (!existingCategory.exists) {
      batch.set(categoryRef, {
        id: category.id,
        name: category.name,
        colorTag: category.colorTag,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  }

  async doesCategoryHaveTransactions(
    userId: string,
    categoryId: string
  ): Promise<boolean> {
    const transactions = await this.collectionService
      .getTransactionCollection(userId)
      .where("category.id", "==", categoryId)
      .get();
    return !transactions.empty;
  }

  async deleteCategoryIfEmpty(
    userId: string,
    categoryId: string,
    batch: FirebaseFirestore.WriteBatch
  ): Promise<void> {
    const hasTransactions = await this.doesCategoryHaveTransactions(
      userId,
      categoryId
    );

    if (!hasTransactions) {
      const categoryRef = this.collectionService
        .getCategoryCollection(userId)
        .doc(categoryId);
      batch.delete(categoryRef);
    }
  }
}
