import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import {
  CreateIncomeDto,
  IncomeDto,
  PaginatedIncomesResponse,
  UpdateIncomeDto,
} from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import { IncomeModel, incomeModelSchema } from "../models/incomeModel";
import { getFirestorePaginatedData } from "./_utils";

export class IncomeRepository implements IIncomeRepository {
  private getIncomeCollection(userId: string) {
    return adminFirestore.collection("users").doc(userId).collection("incomes");
  }

  async createIncome(
    userId: string,
    input: CreateIncomeDto
  ): Promise<IncomeDto> {
    try {
      const id = nanoid(10);
      const incomeRef = this.getIncomeCollection(userId).doc(id);
      const timestamp = FieldValue.serverTimestamp();

      const data = {
        ...input,
        id,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await incomeRef.set(data);
      const incomeDoc = await incomeRef.get();
      return this.mapIncomeModelToDto(incomeDoc.data() as IncomeModel);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to create budget: ${err.message}`);
    }
  }

  async getIncome(userId: string, incomeId: string): Promise<IncomeDto | null> {
    try {
      const incomeDoc = await this.getIncomeCollection(userId)
        .doc(incomeId)
        .get();

      if (!incomeDoc.exists) {
        return null;
      }

      return this.mapIncomeModelToDto(incomeDoc.data() as IncomeModel);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get income: ${err.message}`);
    }
  }

  async getPaginatedIncomes(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedIncomesResponse> {
    try {
      const response = await getFirestorePaginatedData(
        this.getIncomeCollection(userId),
        params,
        incomeModelSchema
      );
      return {
        data: response.data.map((income) => this.mapIncomeModelToDto(income)),
        meta: response.meta,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get incomes: ${err.message}`);
    }
  }

  async updateIncome(
    userId: string,
    incomeId: string,
    input: UpdateIncomeDto
  ): Promise<IncomeDto> {
    try {
      const incomeRef = this.getIncomeCollection(userId).doc(incomeId);
      const timestamp = FieldValue.serverTimestamp();

      const data = {
        ...input,
        updatedAt: timestamp,
      };

      await incomeRef.update(data);
      const incomeDoc = await incomeRef.get();
      return this.mapIncomeModelToDto(incomeDoc.data() as IncomeModel);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to update income: ${err.message}`);
    }
  }

  async incomeExists(userId: string, incomeName: string): Promise<boolean> {
    try {
      const querySnapshot = await this.getIncomeCollection(userId)
        .where("name", "==", incomeName)
        .limit(1)
        .get();

      return !querySnapshot.empty;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to check if budget exists: ${err.message}`);
    }
  }

  async deleteIncome(userId: string, incomeId: string): Promise<void> {
    try {
      await this.getIncomeCollection(userId).doc(incomeId).delete();
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to delete income: ${err.message}`);
    }
  }

  private mapIncomeModelToDto(income: IncomeModel): IncomeDto {
    return {
      id: income.id,
      name: income.name,
      colorTag: income.colorTag,
      createdAt: income.createdAt.toDate(),
      updatedAt: income.updatedAt.toDate(),
    };
  }
}
