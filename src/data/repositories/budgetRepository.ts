import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  BudgetDto,
  BudgetsSummaryDto,
  CreateBudgetDto,
  PaginatedBudgetsResponseDto,
  PaginatedBudgetsWithTransactionsResponseDto,
  UpdateBudgetDto,
  updateBudgetSchema,
} from "@/core/schemas/budgetSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { AggregateField } from "firebase-admin/firestore";
import { BudgetMapper } from "../mappers/BudgetMapper";
import { TransactionMapper } from "../mappers/TransactionMapper";
import {
  budgetModelSchema,
  CreateBudgetModel,
  createBudgetModelSchema,
} from "../models/budgetModel";
import { transactionModelSchema } from "../models/transactionModel";
import { FirestoreService } from "../services/FirestoreService";
import { UtilityService } from "../services/UtilityService";
import { ValidationService } from "../services/ValidationService";

export class BudgetRepository implements IBudgetRepository {
  private readonly firestoreService: FirestoreService;
  private readonly validationService: ValidationService;
  private readonly utilityService: UtilityService;
  private readonly contextName = "BudgetRepository";
  private readonly collectionName = "budgets";

  constructor() {
    this.firestoreService = new FirestoreService();
    this.validationService = new ValidationService();
    this.utilityService = new UtilityService();
  }

  private getConfig() {
    return {
      contextName: this.contextName,
      collectionName: this.collectionName,
    };
  }

  async createBudget(
    userId: string,
    input: CreateBudgetDto
  ): Promise<BudgetDto> {
    const timestamp = this.firestoreService.getCurrentTimestamp();
    const budgetData: CreateBudgetModel = {
      id: "",
      createdAt: timestamp,
      updatedAt: timestamp,
      name: input.name,
      maximumSpending: input.maximumSpending,
      colorTag: input.colorTag,
    };

    const validatedInput = this.validationService.validateInput(
      createBudgetModelSchema,
      budgetData,
      { contextName: this.contextName, operationType: "create" }
    );

    const doc = await this.firestoreService.create(
      userId,
      validatedInput,
      this.getConfig()
    );

    // ✅ Validate output and map to DTO
    const validatedData = this.validationService.validateDocumentData(
      budgetModelSchema,
      doc.data(),
      {
        contextName: this.contextName,
        operationType: "read",
        documentId: doc.id,
      }
    );

    return BudgetMapper.toDto(validatedData);
  }

  async getBudget(userId: string, budgetId: string): Promise<BudgetDto | null> {
    const doc = await this.firestoreService.getById(
      userId,
      budgetId,
      this.getConfig()
    );

    if (!doc) {
      return null;
    }

    const validatedData = this.validationService.validateDocumentData(
      budgetModelSchema,
      doc.data(),
      {
        contextName: this.contextName,
        operationType: "read",
        documentId: budgetId,
      }
    );

    return BudgetMapper.toDto(validatedData);
  }

  async getPaginatedBudgets(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedBudgetsResponseDto> {
    const response = await this.firestoreService.getPaginated(
      userId,
      params,
      budgetModelSchema,
      this.getConfig()
    );

    return {
      data: response.data.map((budget) => BudgetMapper.toDto(budget)),
      meta: response.meta,
    };
  }

  async updateBudget(
    userId: string,
    budgetId: string,
    input: UpdateBudgetDto
  ): Promise<BudgetDto> {
    const validatedInput = this.validationService.validateInput(
      updateBudgetSchema,
      input,
      { contextName: this.contextName, operationType: "update" }
    );

    const doc = await this.firestoreService.update(
      userId,
      budgetId,
      validatedInput,
      this.getConfig()
    );

    const validatedData = this.validationService.validateDocumentData(
      budgetModelSchema,
      doc.data(),
      {
        contextName: this.contextName,
        operationType: "read",
        documentId: budgetId,
      }
    );

    return BudgetMapper.toDto(validatedData);
  }

  async budgetExists(userId: string, budgetName: string): Promise<boolean> {
    return this.firestoreService.existsByName(
      userId,
      budgetName,
      this.getConfig()
    );
  }

  async deleteBudget(userId: string, budgetId: string): Promise<void> {
    return this.firestoreService.delete(userId, budgetId, this.getConfig());
  }

  async getPaginatedBudgetsWithTransactions(
    userId: string,
    params: PaginationParams,
    transactionCount: number = 3
  ): Promise<PaginatedBudgetsWithTransactionsResponseDto> {
    return this.utilityService.executeOperation(
      async () => {
        const collection = this.firestoreService.getCollection(
          userId,
          this.collectionName
        );
        const response = await this.firestoreService.getPaginatedData(
          collection,
          params,
          budgetModelSchema
        );

        const budgetsWithTransactions = await Promise.all(
          response.data.map(async (budget) => {
            const transactionCollection = this.firestoreService.getCollection(
              userId,
              "transactions"
            );
            const transactions = await this.firestoreService.getPaginatedData(
              transactionCollection,
              {
                pagination: {
                  page: 1,
                  limitPerPage: transactionCount,
                },
                sort: {
                  field: "transactionDate",
                  order: "desc",
                },
                filters: [
                  { field: "category.id", operator: "==", value: budget.id },
                ],
                search: "",
              },
              transactionModelSchema
            );

            const query = transactionCollection
              .where("category.id", "==", budget.id)
              .aggregate({
                totalSpent: AggregateField.sum("amount"),
              });

            const snapshot = await query.get();
            const totalSpent = snapshot.data().totalSpent;

            return {
              ...BudgetMapper.toDto(budget),
              spent: totalSpent,
              transactions: transactions.data.map((transaction) =>
                TransactionMapper.toDto(transaction)
              ),
            };
          })
        );

        return {
          data: budgetsWithTransactions,
          meta: response.meta,
        };
      },
      this.contextName,
      "Failed to get paginated budgets with transactions"
    );
  }

  async getBudgetsSummary(
    userId: string,
    budgetCount: number = 10
  ): Promise<BudgetsSummaryDto> {
    return this.utilityService.executeOperation(
      async () => {
        const budgetsCollection = this.firestoreService.getCollection(
          userId,
          this.collectionName
        );
        const transactionCollection = this.firestoreService.getCollection(
          userId,
          "transactions"
        );

        const budgets = await this.getPaginatedBudgets(userId, {
          pagination: {
            page: 1,
            limitPerPage: budgetCount,
          },
          sort: {
            field: "createdAt",
            order: "desc",
          },
          filters: [],
          search: "",
        });
        const totalAmountOfBudgetsSnapshot = await budgetsCollection
          .aggregate({
            totalAmountOfBudgets: AggregateField.sum("maximumSpending"),
          })
          .get();
        const totalAmountOfBudgets =
          totalAmountOfBudgetsSnapshot.data().totalAmountOfBudgets;
        const totalAmountSpentSnapshot = await transactionCollection
          .aggregate({
            totalSpent: AggregateField.sum("amount"),
          })
          .get();
        const totalAmountSpent = totalAmountSpentSnapshot.data().totalSpent;

        return {
          budgets: budgets.data,
          totalAmountOfBudgets: totalAmountOfBudgets,
          totalAmountSpent: totalAmountSpent,
          totalCountOfBudgets: budgets.meta.pagination.totalItems,
        };
      },
      this.contextName,
      "Failed to get budgets summary"
    );
  }
}
