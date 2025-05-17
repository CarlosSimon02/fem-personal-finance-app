import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import {
  BudgetModel,
  CreateBudgetModel,
  UpdateBudgetModel,
} from "../models/budgetModel";

export class BudgetDatasource {
  private getBudgetCollection(userId: string) {
    return adminFirestore.collection("users").doc(userId).collection("budgets");
  }

  async createBudget(
    userId: string,
    data: CreateBudgetModel
  ): Promise<BudgetModel> {
    try {
      const budgetRef = this.getBudgetCollection(userId).doc();
      const timestamp = FieldValue.serverTimestamp();

      const budgetData = {
        ...data,
        uid: budgetRef.id,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await budgetRef.set(budgetData);
      const budgetDoc = await budgetRef.get();
      return budgetDoc.data() as BudgetModel;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to create budget: ${err.message}`);
    }
  }

  async getBudget(
    userId: string,
    budgetId: string
  ): Promise<BudgetModel | null> {
    try {
      const budgetDoc = await this.getBudgetCollection(userId)
        .doc(budgetId)
        .get();

      if (!budgetDoc.exists) {
        return null;
      }

      return budgetDoc.data() as BudgetModel;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get budget: ${err.message}`);
    }
  }

  async getAllBudgets(userId: string): Promise<BudgetModel[]> {
    try {
      const snapshot = await this.getBudgetCollection(userId).get();
      return snapshot.docs.map((doc) => doc.data() as BudgetModel);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get budgets: ${err.message}`);
    }
  }

  async updateBudget(
    userId: string,
    budgetId: string,
    data: UpdateBudgetModel
  ): Promise<BudgetModel> {
    try {
      const budgetRef = this.getBudgetCollection(userId).doc(budgetId);
      const timestamp = FieldValue.serverTimestamp();

      await budgetRef.update({
        ...data,
        updatedAt: timestamp,
      });

      const updatedDoc = await budgetRef.get();
      if (!updatedDoc.exists) {
        throw new Error("Budget not found after update");
      }

      return updatedDoc.data() as BudgetModel;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to update budget: ${err.message}`);
    }
  }

  async deleteBudget(userId: string, budgetId: string): Promise<void> {
    try {
      await this.getBudgetCollection(userId).doc(budgetId).delete();
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to delete budget: ${err.message}`);
    }
  }
}
