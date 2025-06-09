import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { PaginatedCategoriesResponseDto } from "@/core/schemas/categorySchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  CreateTransactionDto,
  PaginatedTransactionsResponseDto,
  TransactionCategoryDto,
  TransactionDto,
  TransactionTypeDto,
  UpdateTransactionDto,
} from "@/core/schemas/transactionSchema";
import { generateId } from "@/utils/generateId";
import { Timestamp } from "firebase-admin/firestore";
import { BudgetDatasource } from "../datasource/BudgetDatasource";
import { CategoryDatasource } from "../datasource/CategoryDatasource";
import { IncomeDatasource } from "../datasource/IncomeDatasource";
import { TransactionDatasource } from "../datasource/TransactionDatasource";
import { CategoryMapper } from "../mappers/CategoryMapper";
import { TransactionMapper } from "../mappers/TransactionMapper";
import {
  CreateTransactionModel,
  UpdateTransactionModel,
} from "../models/transactionModel";
import { ErrorHandlingService } from "../services/ErrorHandlingService";
import { FirestoreService } from "../services/FirestoreService";

export class TransactionRepository implements ITransactionRepository {
  private readonly categoryDatasource: CategoryDatasource;
  private readonly budgetDatasource: BudgetDatasource;
  private readonly incomeDatasource: IncomeDatasource;
  private readonly transactionDatasource: TransactionDatasource;
  private readonly errorHandlingService: ErrorHandlingService;
  private readonly firestoreService: FirestoreService;

  constructor() {
    this.errorHandlingService = new ErrorHandlingService();
    this.categoryDatasource = new CategoryDatasource();
    this.budgetDatasource = new BudgetDatasource();
    this.incomeDatasource = new IncomeDatasource();
    this.firestoreService = new FirestoreService();
    this.transactionDatasource = new TransactionDatasource();
  }

  // #########################################################
  // # 🛠️ Helper Methods
  // #########################################################

  private calculateSignedAmount(amount: number, type: TransactionTypeDto) {
    return type === "income" ? amount : -amount;
  }

  private async createCategoryIfNotExists(
    userId: string,
    category: TransactionCategoryDto
  ) {
    const categoryExists = await this.categoryDatasource.getById(
      userId,
      category.id
    );
    if (categoryExists) {
      return;
    } else {
      await this.categoryDatasource.createOne(userId, {
        id: category.id,
        name: category.name,
        colorTag: category.colorTag,
        createdAt: this.firestoreService.getCurrentTimestamp(),
        updatedAt: this.firestoreService.getCurrentTimestamp(),
      });
    }
  }

  private async deleteCategoryIfNoTransactions(
    userId: string,
    categoryId: string
  ) {
    const hasTransactions = await this.transactionDatasource.hasTransactions(
      userId,
      categoryId
    );
    if (!hasTransactions) {
      await this.categoryDatasource.deleteOne(userId, categoryId);
    }
  }

  private async getAndMapTransaction(
    userId: string,
    transactionId: string
  ): Promise<TransactionDto> {
    const transaction = await this.transactionDatasource.getById(
      userId,
      transactionId
    );
    if (!transaction) {
      throw new Error(
        `Transaction ${transactionId} not found for user ${userId}`
      );
    }
    return TransactionMapper.toDto(transaction);
  }

  private async updateCategoryTotal(
    userId: string,
    categoryId: string,
    type: TransactionTypeDto
  ) {
    const total = await this.transactionDatasource.calculateTotalByCategory(
      userId,
      categoryId
    );

    if (type === "income") {
      this.incomeDatasource.setTotalEarned(userId, categoryId, total);
    } else {
      this.budgetDatasource.setTotalSpending(userId, categoryId, total);
    }
  }

  // #########################################################
  // # 📝 Create One
  // #########################################################

  private async getTransactionCategory(
    userId: string,
    categoryId: string,
    type: TransactionTypeDto
  ): Promise<TransactionCategoryDto> {
    if (type === "income") {
      const income = await this.incomeDatasource.getById(userId, categoryId);
      if (!income) {
        throw new Error("Category ID not found for income");
      }
      return {
        colorTag: income.colorTag,
        id: income.id,
        name: income.name,
      };
    } else {
      const budget = await this.budgetDatasource.getById(userId, categoryId);
      if (!budget) {
        throw new Error("Category ID not found for budget");
      }

      return {
        colorTag: budget.colorTag,
        id: budget.id,
        name: budget.name,
      };
    }
  }

  private async buildTransactionData(
    userId: string,
    input: CreateTransactionDto
  ): Promise<CreateTransactionModel> {
    const category = await this.getTransactionCategory(
      userId,
      input.categoryId,
      input.type
    );

    return {
      id: generateId(),
      createdAt: this.firestoreService.getCurrentTimestamp(),
      updatedAt: this.firestoreService.getCurrentTimestamp(),
      type: input.type,
      amount: input.amount,
      signedAmount: this.calculateSignedAmount(input.amount, input.type),
      recipientOrPayer: input.recipientOrPayer,
      category,
      transactionDate: Timestamp.fromDate(input.transactionDate),
      description: input.description,
      emoji: input.emoji,
      name: input.name,
    };
  }

  async createOne(
    userId: string,
    input: CreateTransactionDto
  ): Promise<TransactionDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const transactionData = await this.buildTransactionData(userId, input);

        // Save data
        await this.transactionDatasource.createOne(userId, transactionData);

        // Side effects
        this.createCategoryIfNotExists(userId, transactionData.category);
        this.updateCategoryTotal(
          userId,
          transactionData.category.id,
          transactionData.type
        );

        // Return data
        return await this.getAndMapTransaction(userId, transactionData.id);
      },
      {
        contextName: "TransactionRepository",
        operationType: "create",
        userId: userId,
        additionalInfo: {
          input: input,
        },
      },
      "Failed to create transaction"
    );
  }

  // #########################################################
  // # 📃 Get One By Id
  // #########################################################

  async getOneById(
    userId: string,
    transactionId: string
  ): Promise<TransactionDto | null> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const transaction = await this.transactionDatasource.getById(
          userId,
          transactionId
        );

        // Return data
        return transaction ? TransactionMapper.toDto(transaction) : null;
      },
      {
        contextName: "TransactionRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          transactionId: transactionId,
        },
      },
      "Failed to get transaction"
    );
  }

  // #########################################################
  // # 📗 Get Paginated
  // #########################################################

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedTransactionsResponseDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const response = await this.transactionDatasource.getPaginated(
          userId,
          params
        );

        // Return data
        return {
          data: response.data.map(TransactionMapper.toDto),
          meta: response.meta,
        };
      },
      {
        contextName: "TransactionRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          params: params,
        },
      },
      "Failed to get paginated transactions"
    );
  }

  // #########################################################
  // # 🔄 Update One
  // #########################################################

  private async buildUpdateData(
    currentTransaction: TransactionDto,
    userId: string,
    input: UpdateTransactionDto
  ): Promise<UpdateTransactionModel> {
    const updateData: UpdateTransactionModel = {
      updatedAt: this.firestoreService.getCurrentTimestamp(),
    };

    if (input.name !== undefined && input.name !== currentTransaction.name) {
      updateData.name = input.name;
    }

    if (input.type !== undefined && input.type !== currentTransaction.type) {
      if (input.categoryId === undefined) {
        throw new Error(
          "Category ID is required when updating transaction type"
        );
      }
      updateData.type = input.type;
    }

    if (
      input.categoryId !== undefined &&
      input.categoryId !== currentTransaction.category.id
    ) {
      updateData.category = await this.getTransactionCategory(
        userId,
        input.categoryId,
        input.type ?? currentTransaction.type
      );
    }

    if (
      input.amount !== undefined &&
      input.amount !== currentTransaction.amount
    ) {
      updateData.amount = input.amount;
      updateData.signedAmount = this.calculateSignedAmount(
        input.amount,
        input.type ?? currentTransaction.type
      );
    }

    if (
      input.recipientOrPayer !== undefined &&
      input.recipientOrPayer !== currentTransaction.recipientOrPayer
    ) {
      updateData.recipientOrPayer = input.recipientOrPayer;
    }

    if (
      input.transactionDate !== undefined &&
      input.transactionDate !== currentTransaction.transactionDate
    ) {
      updateData.transactionDate = Timestamp.fromDate(input.transactionDate);
    }

    if (
      input.description !== undefined &&
      input.description !== currentTransaction.description
    ) {
      updateData.description = input.description;
    }

    if (input.emoji !== undefined && input.emoji !== currentTransaction.emoji) {
      updateData.emoji = input.emoji;
    }

    return updateData;
  }

  async updateOne(
    userId: string,
    transactionId: string,
    input: UpdateTransactionDto
  ): Promise<TransactionDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const currentTransactionDto = await this.getAndMapTransaction(
          userId,
          transactionId
        );

        const updateData = await this.buildUpdateData(
          currentTransactionDto,
          userId,
          input
        );

        // Save data
        await this.transactionDatasource.updateOne(
          userId,
          transactionId,
          updateData
        );

        // Side effects
        if (updateData.category) {
          this.deleteCategoryIfNoTransactions(
            userId,
            currentTransactionDto.category.id
          );
          this.createCategoryIfNotExists(userId, updateData.category);

          this.updateCategoryTotal(
            userId,
            updateData.category.id,
            updateData.type ?? currentTransactionDto.type
          );

          this.updateCategoryTotal(
            userId,
            currentTransactionDto.category.id,
            currentTransactionDto.type
          );
        }

        // Return data
        return await this.getAndMapTransaction(userId, transactionId);
      },
      {
        contextName: "TransactionRepository",
        operationType: "update",
        userId: userId,
        additionalInfo: {
          transactionId: transactionId,
          input: input,
        },
      },
      "Failed to update transaction"
    );
  }

  // #########################################################
  // # 🗑️ Delete One
  // #########################################################

  async deleteOne(userId: string, transactionId: string): Promise<void> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const currentTransactionDto = await this.getAndMapTransaction(
          userId,
          transactionId
        );

        // Save data
        await this.transactionDatasource.deleteOne(userId, transactionId);

        // Side effects
        this.deleteCategoryIfNoTransactions(
          userId,
          currentTransactionDto.category.id
        );

        this.updateCategoryTotal(
          userId,
          currentTransactionDto.category.id,
          currentTransactionDto.type
        );

        // Return data
        return;
      },
      {
        contextName: "TransactionRepository",
        operationType: "delete",
        userId: userId,
        additionalInfo: {
          transactionId: transactionId,
        },
      },
      "Failed to delete transaction"
    );
  }

  // #########################################################
  // # 📊 Get Paginated Categories
  // #########################################################

  async getPaginatedCategories(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedCategoriesResponseDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        const response = await this.categoryDatasource.getPaginated(
          userId,
          params
        );
        return {
          data: response.data.map(CategoryMapper.toDto),
          meta: response.meta,
        };
      },
      {
        contextName: "TransactionRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          params: params,
        },
      },
      "Failed to get paginated categories"
    );
  }
}
