import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  BudgetDto,
  BudgetPaginationParams,
  BudgetPaginationResponse,
  CreateBudgetDto,
  UpdateBudgetDto,
} from "@/core/schemas/budgetSchema";
import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import { BudgetModel } from "../models/budgetModel";

export class BudgetRepository implements IBudgetRepository {
  private getBudgetCollection(userId: string) {
    return adminFirestore.collection("users").doc(userId).collection("budgets");
  }

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
    params: BudgetPaginationParams
  ): Promise<BudgetPaginationResponse> {
    try {
      console.log(params, userId);
      return {} as BudgetPaginationResponse;
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

  // private async handleFirestoreQuery(
  //   userId: string,
  //   params: Omit<BudgetPaginationParams, "search">
  // ): Promise<BudgetPaginationResponse> {
  //   const q = this.getBudgetCollection(userId)
  //     .orderBy(params.sort.field, params.sort.order)
  //     .(params.pagination.page * params.pagination.limitPerPage)
  //     .limit(params.pagination.limitPerPage);

  //   const [snapshot, countQuery] = await Promise.all([
  //     q.get(),
  //     this.getBudgetCollection(userId).count().get(),
  //   ]);

  //   const lastVisible = snapshot.docs[snapshot.docs.length - 1];
  //   const totalCount = countQuery.data().count;

  //   return {
  //     data: snapshot.docs.map((doc) =>
  //       this.mapBudgetModelToDto(doc.data() as BudgetModel)
  //     ),
  //     meta: {
  //       pagination: {
  //         totalItems: totalCount,
  //         page: params.pagination.page,
  //         limitPerPage: params.pagination.limitPerPage,
  //         nextPage: params.pagination.page + 1,
  //         previousPage: params.pagination.page - 1,
  //       },
  //       sort: params.sort,
  //       filters: params.filters,
  //       search: params.search,
  //     },
  //   };
  // }
}
