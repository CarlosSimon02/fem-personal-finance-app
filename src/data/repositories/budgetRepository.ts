import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  BudgetDto,
  CreateBudgetDto,
  PaginatedBudgetsResponse,
  UpdateBudgetDto,
} from "@/core/schemas/budgetSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import {
  BudgetModel,
  BudgetModelPaginationResponse,
  budgetModelSchema,
} from "../models/budgetModel";
import { getFirestorePaginatedData, getPaginatedAlgoliaData } from "./_utils";

export class BudgetRepository implements IBudgetRepository {
  private getBudgetCollection(userId: string) {
    return adminFirestore.collection("users").doc(userId).collection("budgets");
  }

  private ALGOLIA_BUDGETS_INDEX = "budgets";

  async createBudget(
    userId: string,
    input: CreateBudgetDto
  ): Promise<BudgetDto> {
    try {
      const id = nanoid(10);
      const budgetRef = this.getBudgetCollection(userId).doc(id);
      const timestamp = FieldValue.serverTimestamp();

      const data = {
        ...input,
        id,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await budgetRef.set(data);
      const budgetDoc = await budgetRef.get();
      return this.mapBudgetModelToDto(budgetDoc.data() as BudgetModel);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to create budget: ${err.message}`);
    }
  }

  async getBudget(userId: string, budgetId: string): Promise<BudgetDto | null> {
    try {
      const budgetDoc = await this.getBudgetCollection(userId)
        .doc(budgetId)
        .get();

      if (!budgetDoc.exists) {
        return null;
      }

      return this.mapBudgetModelToDto(budgetDoc.data() as BudgetModel);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get budget: ${err.message}`);
    }
  }

  async getPaginatedBudgets(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedBudgetsResponse> {
    try {
      let response: BudgetModelPaginationResponse;

      if (params.search) {
        response = await getPaginatedAlgoliaData(
          this.ALGOLIA_BUDGETS_INDEX,
          params,
          budgetModelSchema
        );
      } else {
        response = await getFirestorePaginatedData(
          this.getBudgetCollection(userId),
          params,
          budgetModelSchema
        );
      }

      return {
        data: response.data.map((budget) => this.mapBudgetModelToDto(budget)),
        meta: response.meta,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get budgets: ${err.message}`);
    }
  }

  async updateBudget(
    userId: string,
    budgetId: string,
    input: UpdateBudgetDto
  ): Promise<BudgetDto> {
    try {
      const budgetRef = this.getBudgetCollection(userId).doc(budgetId);
      const timestamp = FieldValue.serverTimestamp();

      const data = {
        ...input,
        updatedAt: timestamp,
      };

      await budgetRef.update(data);
      const budgetDoc = await budgetRef.get();
      return this.mapBudgetModelToDto(budgetDoc.data() as BudgetModel);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to update budget: ${err.message}`);
    }
  }

  async budgetExists(userId: string, budgetName: string): Promise<boolean> {
    try {
      const querySnapshot = await this.getBudgetCollection(userId)
        .where("name", "==", budgetName)
        .limit(1)
        .get();

      return !querySnapshot.empty;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to check if budget exists: ${err.message}`);
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

  private mapBudgetModelToDto(budget: BudgetModel): BudgetDto {
    return {
      id: budget.id,
      name: budget.name,
      maximumSpending: budget.maximumSpending,
      colorTag: budget.colorTag,
      createdAt: budget.createdAt.toDate(),
      updatedAt: budget.updatedAt.toDate(),
    };
  }
}
