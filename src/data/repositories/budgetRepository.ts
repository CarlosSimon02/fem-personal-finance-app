import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  BudgetDto,
  BudgetsSummaryDto,
  CreateBudgetDto,
  PaginatedBudgetsResponseDto,
  PaginatedBudgetsWithTransactionsResponseDto,
  UpdateBudgetDto,
} from "@/core/schemas/budgetSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { generateId } from "@/utils/generateId";
import { BudgetDatasource } from "../datasource/BudgetDatasource";
import { TransactionDatasource } from "../datasource/TransactionDatasource";
import { BudgetMapper } from "../mappers/BudgetMapper";
import { TransactionMapper } from "../mappers/TransactionMapper";
import { CreateBudgetModel, UpdateBudgetModel } from "../models/budgetModel";
import { ErrorHandlingService } from "../services/ErrorHandlingService";
import { FirestoreService } from "../services/FirestoreService";

export class BudgetRepository implements IBudgetRepository {
  private readonly budgetDatasource: BudgetDatasource;
  private readonly transactionDatasource: TransactionDatasource;
  private readonly errorHandlingService: ErrorHandlingService;
  private readonly firestoreService: FirestoreService;

  constructor() {
    this.budgetDatasource = new BudgetDatasource();
    this.transactionDatasource = new TransactionDatasource();
    this.errorHandlingService = new ErrorHandlingService();
    this.firestoreService = new FirestoreService();
  }

  // #########################################################
  // # 🛠️ Helper Methods
  // #########################################################

  private async getAndMapBudget(
    userId: string,
    budgetId: string
  ): Promise<BudgetDto> {
    const budget = await this.budgetDatasource.getById(userId, budgetId);
    if (!budget)
      throw new Error(`Budget ${budgetId} not found for user ${userId}`);
    return BudgetMapper.toDto(budget);
  }

  // #########################################################
  // # 📝 Create One
  // #########################################################

  private async buildBudgetData(
    input: CreateBudgetDto
  ): Promise<CreateBudgetModel> {
    return {
      id: generateId(),
      createdAt: this.firestoreService.getCurrentTimestamp(),
      updatedAt: this.firestoreService.getCurrentTimestamp(),
      name: input.name,
      maximumSpending: input.maximumSpending,
      colorTag: input.colorTag,
      totalSpending: 0,
    };
  }

  async createOne(userId: string, input: CreateBudgetDto): Promise<BudgetDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const budgetData = await this.buildBudgetData(input);

        // Save data
        await this.budgetDatasource.createOne(userId, budgetData);

        // Return data
        return await this.getAndMapBudget(userId, budgetData.id);
      },
      {
        contextName: "BudgetRepository",
        operationType: "create",
        userId: userId,
        additionalInfo: {
          input: input,
        },
      },
      "Failed to create budget"
    );
  }

  // #########################################################
  // # 📃 Get One By Id
  // #########################################################

  async getOneById(
    userId: string,
    budgetId: string
  ): Promise<BudgetDto | null> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const budget = await this.budgetDatasource.getById(userId, budgetId);

        // Return data
        return budget ? BudgetMapper.toDto(budget) : null;
      },
      {
        contextName: "BudgetRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          budgetId: budgetId,
        },
      },
      "Failed to get budget"
    );
  }

  async getOneByName(userId: string, name: string): Promise<BudgetDto | null> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        const budget = await this.budgetDatasource.getByName(userId, name);
        return budget ? BudgetMapper.toDto(budget) : null;
      },
      {
        contextName: "BudgetRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          name: name,
        },
      },
      "Failed to get budget by name"
    );
  }

  // #########################################################
  // # 📗 Get Paginated
  // #########################################################

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedBudgetsResponseDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const response = await this.budgetDatasource.getPaginated(
          userId,
          params
        );

        // Return data
        return {
          data: response.data.map(BudgetMapper.toDto),
          meta: response.meta,
        };
      },
      {
        contextName: "BudgetRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          params: params,
        },
      },
      "Failed to get paginated budgets"
    );
  }

  // #########################################################
  // # 📗 Get Paginated With Transactions
  // #########################################################

  async getLatestTransactionsForBudget(
    userId: string,
    budgetId: string,
    maxTransactionsToShow: number = 12
  ) {
    const response = await this.transactionDatasource.getPaginated(userId, {
      sort: {
        field: "transactionDate",
        order: "desc",
      },
      pagination: {
        page: 1,
        limitPerPage: maxTransactionsToShow,
      },
      filters: [
        {
          field: "category.id",
          operator: "==",
          value: budgetId,
        },
      ],
    });

    return response.data.map((transaction) =>
      TransactionMapper.toDto(transaction)
    );
  }

  async getPaginatedWithTransactions(
    userId: string,
    params: PaginationParams,
    maxTransactionsToShow: number = 3
  ): Promise<PaginatedBudgetsWithTransactionsResponseDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        const response = await this.budgetDatasource.getPaginated(
          userId,
          params
        );

        const budgetsWithTransactions = await Promise.all(
          response.data.map(async (budget) => {
            const [totalSpending, transactions] = await Promise.all([
              this.transactionDatasource.calculateTotalByCategory(
                userId,
                budget.id
              ),
              this.getLatestTransactionsForBudget(
                userId,
                budget.id,
                maxTransactionsToShow
              ),
            ]);

            return {
              ...BudgetMapper.toDto(budget),
              transactions,
              totalSpending,
            };
          })
        );

        return {
          data: budgetsWithTransactions,
          meta: response.meta,
        };
      },
      {
        contextName: "BudgetRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          params: params,
        },
      },
      "Failed to get paginated budgets with transactions"
    );
  }

  // #########################################################
  // # 📃 Update One
  // #########################################################

  private async buildUpdateData(
    currentBudget: BudgetDto,
    input: UpdateBudgetDto
  ): Promise<UpdateBudgetModel> {
    const updateData: UpdateBudgetModel = {
      updatedAt: this.firestoreService.getCurrentTimestamp(),
    };

    if (input.name !== undefined && input.name !== currentBudget.name) {
      updateData.name = input.name;
    }

    if (
      input.maximumSpending !== undefined &&
      input.maximumSpending !== currentBudget.maximumSpending
    ) {
      updateData.maximumSpending = input.maximumSpending;
    }

    if (
      input.colorTag !== undefined &&
      input.colorTag !== currentBudget.colorTag
    ) {
      updateData.colorTag = input.colorTag;
    }

    return updateData;
  }

  async updateOne(
    userId: string,
    budgetId: string,
    input: UpdateBudgetDto
  ): Promise<BudgetDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const currentBudget = await this.getAndMapBudget(userId, budgetId);
        const updateData = await this.buildUpdateData(currentBudget, input);

        // Update data
        await this.budgetDatasource.updateOne(userId, budgetId, updateData);

        // Return data
        return await this.getAndMapBudget(userId, budgetId);
      },
      {
        contextName: "BudgetRepository",
        operationType: "update",
        userId: userId,
        additionalInfo: {
          budgetId: budgetId,
          input: input,
        },
      },
      "Failed to update budget"
    );
  }

  // #########################################################
  // # 📄 Delete One
  // #########################################################

  async deleteOne(userId: string, budgetId: string): Promise<void> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const currentBudget = await this.getAndMapBudget(userId, budgetId);

        // Delete data
        await this.budgetDatasource.deleteOne(userId, budgetId);
      },
      {
        contextName: "BudgetRepository",
        operationType: "delete",
        userId: userId,
        additionalInfo: {
          budgetId: budgetId,
        },
      },
      "Failed to delete budget"
    );
  }

  // #########################################################
  // # 📈 Get Summary
  // #########################################################

  private async getBudgetsToShowInSummary(
    userId: string,
    maxBudgetsToShow: number
  ) {
    const response = await this.budgetDatasource.getPaginated(userId, {
      sort: {
        field: "totalSpending",
        order: "asc",
      },
      pagination: {
        page: 1,
        limitPerPage: maxBudgetsToShow,
      },
      filters: [],
    });

    return response.data.map(BudgetMapper.toDtoWithTotalSpending);
  }

  async getSummary(
    userId: string,
    maxBudgetsToShow: number
  ): Promise<BudgetsSummaryDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        const [budgets, totalSpending, totalMaxSpending, count] =
          await Promise.all([
            this.getBudgetsToShowInSummary(userId, maxBudgetsToShow),
            this.transactionDatasource.calculateTotalByType(userId, "expense"),
            this.budgetDatasource.getTotalMaxSpending(userId),
            this.budgetDatasource.getCount(userId),
          ]);

        return {
          totalSpending,
          totalMaxSpending,
          budgets,
          count,
        };
      },
      {
        contextName: "BudgetRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          maxBudgetsToShow: maxBudgetsToShow,
        },
      },
      "Failed to get summary"
    );
  }
}
