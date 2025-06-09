import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import {
  CreateIncomeDto,
  IncomeDto,
  IncomesSummaryDto,
  PaginatedIncomesResponseDto,
  PaginatedIncomesWithTransactionsResponseDto,
  UpdateIncomeDto,
} from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { generateId } from "@/utils/generateId";
import { IncomeDatasource } from "../datasource/IncomeDatasource";
import { TransactionDatasource } from "../datasource/TransactionDatasource";
import { IncomeMapper } from "../mappers/IncomeMapper";
import { TransactionMapper } from "../mappers/TransactionMapper";
import { CreateIncomeModel, UpdateIncomeModel } from "../models/incomeModel";
import { ErrorHandlingService } from "../services/ErrorHandlingService";
import { FirestoreService } from "../services/FirestoreService";

export class IncomeRepository implements IIncomeRepository {
  private readonly incomeDatasource: IncomeDatasource;
  private readonly transactionDatasource: TransactionDatasource;
  private readonly errorHandlingService: ErrorHandlingService;
  private readonly firestoreService: FirestoreService;

  constructor() {
    this.incomeDatasource = new IncomeDatasource();
    this.transactionDatasource = new TransactionDatasource();
    this.errorHandlingService = new ErrorHandlingService();
    this.firestoreService = new FirestoreService();
  }

  // #########################################################
  // # 🛠️ Helper Methods
  // #########################################################

  private async getAndMapIncome(
    userId: string,
    incomeId: string
  ): Promise<IncomeDto> {
    const income = await this.incomeDatasource.getById(userId, incomeId);
    if (!income)
      throw new Error(`Income ${incomeId} not found for user ${userId}`);
    return IncomeMapper.toDto(income);
  }

  // #########################################################
  // # 📝 Create One
  // #########################################################

  private async buildIncomeData(
    input: CreateIncomeDto
  ): Promise<CreateIncomeModel> {
    return {
      id: generateId(),
      createdAt: this.firestoreService.getCurrentTimestamp(),
      updatedAt: this.firestoreService.getCurrentTimestamp(),
      name: input.name,
      colorTag: input.colorTag,
      totalEarned: 0,
    };
  }

  async createOne(userId: string, input: CreateIncomeDto): Promise<IncomeDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const incomeData = await this.buildIncomeData(input);

        // Save data
        await this.incomeDatasource.createOne(userId, incomeData);

        // Return data
        return await this.getAndMapIncome(userId, incomeData.id);
      },
      {
        contextName: "IncomeRepository",
        operationType: "create",
        userId: userId,
        additionalInfo: {
          input: input,
        },
      },
      "Failed to create income"
    );
  }

  // #########################################################
  // # 📃 Get One
  // #########################################################

  async getOneById(
    userId: string,
    incomeId: string
  ): Promise<IncomeDto | null> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const income = await this.incomeDatasource.getById(userId, incomeId);

        // Return data
        return income ? IncomeMapper.toDto(income) : null;
      },
      {
        contextName: "IncomeRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          incomeId: incomeId,
        },
      },
      "Failed to get income"
    );
  }

  async getOneByName(userId: string, name: string): Promise<IncomeDto | null> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        const income = await this.incomeDatasource.getByName(userId, name);
        return income ? IncomeMapper.toDto(income) : null;
      },
      {
        contextName: "IncomeRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          name: name,
        },
      },
      "Failed to get income by name"
    );
  }

  // #########################################################
  // # 📗 Get Paginated
  // #########################################################

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedIncomesResponseDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const response = await this.incomeDatasource.getPaginated(
          userId,
          params
        );

        // Return data
        return {
          data: response.data.map(IncomeMapper.toDto),
          meta: response.meta,
        };
      },
      {
        contextName: "IncomeRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          params: params,
        },
      },
      "Failed to get paginated incomes"
    );
  }

  // #########################################################
  // # 📗 Get Paginated With Transactions
  // #########################################################

  async getLatestTransactionsForIncome(
    userId: string,
    incomeId: string,
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
          value: incomeId,
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
  ): Promise<PaginatedIncomesWithTransactionsResponseDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        const response = await this.incomeDatasource.getPaginated(
          userId,
          params
        );

        const incomesWithTransactions = await Promise.all(
          response.data.map(async (income) => {
            const [totalEarned, transactions] = await Promise.all([
              this.transactionDatasource.calculateTotalByCategory(
                userId,
                income.id
              ),
              this.getLatestTransactionsForIncome(
                userId,
                income.id,
                maxTransactionsToShow
              ),
            ]);

            return {
              ...IncomeMapper.toDto(income),
              transactions,
              totalEarned,
            };
          })
        );

        return {
          data: incomesWithTransactions,
          meta: response.meta,
        };
      },
      {
        contextName: "IncomeRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          params: params,
        },
      },
      "Failed to get paginated incomes with transactions"
    );
  }

  // #########################################################
  // # 📃 Update One
  // #########################################################

  private async buildUpdateData(
    currentIncome: IncomeDto,
    input: UpdateIncomeDto
  ): Promise<UpdateIncomeModel> {
    const updateData: UpdateIncomeModel = {
      updatedAt: this.firestoreService.getCurrentTimestamp(),
    };

    if (input.name !== undefined && input.name !== currentIncome.name) {
      updateData.name = input.name;
    }

    if (
      input.colorTag !== undefined &&
      input.colorTag !== currentIncome.colorTag
    ) {
      updateData.colorTag = input.colorTag;
    }

    return updateData;
  }

  async updateOne(
    userId: string,
    incomeId: string,
    input: UpdateIncomeDto
  ): Promise<IncomeDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const currentIncome = await this.getAndMapIncome(userId, incomeId);
        const updateData = await this.buildUpdateData(currentIncome, input);

        // Update data
        await this.incomeDatasource.updateOne(userId, incomeId, updateData);

        // Return data
        return await this.getAndMapIncome(userId, incomeId);
      },
      {
        contextName: "IncomeRepository",
        operationType: "update",
        userId: userId,
        additionalInfo: {
          incomeId: incomeId,
          input: input,
        },
      },
      "Failed to update income"
    );
  }

  // #########################################################
  // # 📄 Delete One
  // #########################################################

  async deleteOne(userId: string, incomeId: string): Promise<void> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const currentIncome = await this.getAndMapIncome(userId, incomeId);

        // Delete data
        await this.incomeDatasource.deleteOne(userId, incomeId);
      },
      {
        contextName: "IncomeRepository",
        operationType: "delete",
        userId: userId,
        additionalInfo: {
          incomeId: incomeId,
        },
      },
      "Failed to delete income"
    );
  }

  // #########################################################
  // # 📈 Get Summary
  // #########################################################

  private async getIncomesToShowInSummary(
    userId: string,
    maxIncomesToShow: number
  ) {
    const response = await this.incomeDatasource.getPaginated(userId, {
      sort: {
        field: "totalEarned",
        order: "desc",
      },
      pagination: {
        page: 1,
        limitPerPage: maxIncomesToShow,
      },
      filters: [],
    });

    return response.data.map(IncomeMapper.toDtoWithTotalEarned);
  }

  async getSummary(
    userId: string,
    maxIncomesToShow: number
  ): Promise<IncomesSummaryDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        const [incomes, totalEarned, count] = await Promise.all([
          this.getIncomesToShowInSummary(userId, maxIncomesToShow),
          this.transactionDatasource.calculateTotalByType(userId, "expense"),
          this.incomeDatasource.getCount(userId),
        ]);

        return {
          incomes,
          totalEarned,
          count,
        };
      },
      {
        contextName: "IncomeRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          maxIncomesToShow: maxIncomesToShow,
        },
      },
      "Failed to get summary"
    );
  }
}
