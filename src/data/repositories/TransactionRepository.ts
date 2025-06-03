import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  CreateTransactionDto,
  PaginatedCategoriesResponse,
  PaginatedTransactionsResponse,
  TransactionDto,
  UpdateTransactionDto,
  updateTransactionSchema,
} from "@/core/schemas/transactionSchema";
import {
  categoryModelSchema,
  CreateTransactionModel,
  createTransactionModelSchema,
  transactionModelSchema,
  UpdateTransactionModel,
} from "@/data/models/transactionModel";
import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { TransactionMapper } from "./_mappers/TransactionMapper";
import {
  CollectionService,
  FirestoreService,
  TransactionMigrationService,
  ValidationService,
} from "./_services";
import { CategoryService } from "./_services/CategoryService";

export class TransactionRepository implements ITransactionRepository {
  private readonly firestoreService: FirestoreService;
  private readonly validationService: ValidationService;
  private readonly collectionService: CollectionService;
  private readonly migrationService: TransactionMigrationService;
  private readonly contextName = "TransactionRepository";

  private categoryService: CategoryService;

  constructor() {
    this.firestoreService = new FirestoreService();
    this.validationService = new ValidationService();
    this.collectionService = new CollectionService();
    this.migrationService = new TransactionMigrationService();

    this.categoryService = new CategoryService();
  }

  private calculateSignedAmount(amount: number, type: string): number {
    return type === "income" ? amount : -amount;
  }

  async createTransaction(
    userId: string,
    input: CreateTransactionDto
  ): Promise<TransactionDto> {
    return this.firestoreService.executeOperation(
      async () => {
        const batch = adminFirestore.batch();
        const transactionDate = Timestamp.fromDate(input.transactionDate);
        const id = this.firestoreService.generateId();
        const timestamp = this.firestoreService.getCurrentTimestamp();
        const category = await this.categoryService.getCategory(
          userId,
          input.categoryId,
          input.type
        );

        const transactionRef = this.collectionService
          .getTransactionCollection(userId)
          .doc(id);

        const transactionData: CreateTransactionModel = {
          id,
          createdAt: timestamp,
          updatedAt: timestamp,
          type: input.type,
          amount: input.amount,
          signedAmount: this.calculateSignedAmount(input.amount, input.type),
          recipientOrPayer: input.recipientOrPayer,
          category: category,
          transactionDate: transactionDate,
          description: input.description,
          emoji: input.emoji,
          name: input.name,
        };

        const validatedInput = this.validationService.validateInput(
          createTransactionModelSchema,
          transactionData,
          { contextName: this.contextName, operationType: "create" }
        );

        batch.set(transactionRef, validatedInput);

        await this.categoryService.createCategoryIfNotExists(
          userId,
          category,
          batch
        );

        await batch.commit();

        const transactionDoc = await transactionRef.get();
        const docData = transactionDoc.data();

        if (!docData) {
          throw new Error("Transaction not found after creation");
        }

        const validatedData = this.validationService.validateDocumentData(
          transactionModelSchema,
          docData,
          {
            contextName: this.contextName,
            operationType: "read",
            documentId: id,
          }
        );

        return TransactionMapper.toDto(validatedData);
      },
      this.contextName,
      "Failed to create transaction"
    );
  }

  async getTransaction(
    userId: string,
    transactionId: string
  ): Promise<TransactionDto | null> {
    return this.firestoreService.executeOperation(
      async () => {
        const transactionDoc = await this.collectionService
          .getTransactionCollection(userId)
          .doc(transactionId)
          .get();

        if (!transactionDoc.exists) {
          return null;
        }

        const docData = transactionDoc.data();
        const validatedData = this.validationService.validateDocumentData(
          transactionModelSchema,
          docData,
          {
            contextName: this.contextName,
            operationType: "read",
            documentId: transactionId,
          }
        );

        return TransactionMapper.toDto(validatedData);
      },
      this.contextName,
      "Failed to get transaction"
    );
  }

  async getPaginatedTransactions(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedTransactionsResponse> {
    return this.firestoreService.executeOperation(
      async () => {
        const response = await this.firestoreService.getPaginatedData(
          this.collectionService.getTransactionCollection(userId),
          params,
          transactionModelSchema
        );

        return {
          data: response.data.map((transaction) =>
            TransactionMapper.toDto(transaction)
          ),
          meta: response.meta,
        };
      },
      this.contextName,
      "Failed to get paginated transactions"
    );
  }

  private async buildUpdateData(
    currentTransaction: TransactionDto,
    input: UpdateTransactionDto
  ): Promise<UpdateTransactionModel> {
    const updateData: UpdateTransactionModel = {
      updatedAt: this.firestoreService.getCurrentTimestamp(),
    };

    if (input.name !== undefined && input.name !== currentTransaction.name) {
      updateData.name = input.name;
    }

    if (input.type !== undefined && input.type !== currentTransaction.type) {
      updateData.type = input.type;
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

  private async handleCategoryUpdate(
    userId: string,
    currentTransaction: TransactionDto,
    input: UpdateTransactionDto,
    batch: FirebaseFirestore.WriteBatch
  ): Promise<void> {
    if (
      input.categoryId !== undefined &&
      input.categoryId !== currentTransaction.category.id
    ) {
      const newCategory = await this.categoryService.getCategory(
        userId,
        input.categoryId,
        currentTransaction.type
      );

      await this.categoryService.createCategoryIfNotExists(
        userId,
        newCategory,
        batch
      );

      await this.categoryService.deleteCategoryIfEmpty(
        userId,
        currentTransaction.category.id,
        batch
      );
    }
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    input: UpdateTransactionDto
  ): Promise<TransactionDto> {
    return this.firestoreService.executeOperation(
      async () => {
        const validatedInput = this.validationService.validateInput(
          updateTransactionSchema,
          input,
          { contextName: this.contextName, operationType: "update" }
        );

        const batch = adminFirestore.batch();
        const transactionRef = this.collectionService
          .getTransactionCollection(userId)
          .doc(transactionId);

        const currentTransaction = await this.getTransaction(
          userId,
          transactionId
        );

        if (!currentTransaction) {
          throw new Error("Transaction not found");
        }

        const updateData = await this.buildUpdateData(
          currentTransaction,
          validatedInput
        );

        if (
          validatedInput.categoryId !== undefined &&
          validatedInput.categoryId !== currentTransaction.category.id
        ) {
          const category = await this.categoryService.getCategory(
            userId,
            validatedInput.categoryId,
            currentTransaction.type
          );
          updateData.category = category;
        }

        await this.handleCategoryUpdate(
          userId,
          currentTransaction,
          validatedInput,
          batch
        );
        batch.update(transactionRef, updateData);
        await batch.commit();

        const updatedTransaction = await transactionRef.get();

        if (!updatedTransaction.exists) {
          throw new Error("Transaction not found after update");
        }

        const updatedData = updatedTransaction.data();
        const validatedData = this.validationService.validateDocumentData(
          transactionModelSchema,
          updatedData,
          {
            contextName: this.contextName,
            operationType: "read",
            documentId: transactionId,
          }
        );

        return TransactionMapper.toDto(validatedData);
      },
      this.contextName,
      "Failed to update transaction"
    );
  }

  async deleteTransaction(
    userId: string,
    transactionId: string
  ): Promise<void> {
    return this.firestoreService.executeOperation(
      async () => {
        await this.collectionService
          .getTransactionCollection(userId)
          .doc(transactionId)
          .delete();
      },
      this.contextName,
      "Failed to delete transaction"
    );
  }

  async getPaginatedCategories(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedCategoriesResponse> {
    return this.firestoreService.executeOperation(
      async () => {
        const response = await this.firestoreService.getPaginatedData(
          this.collectionService.getCategoryCollection(userId),
          params,
          categoryModelSchema
        );

        return {
          data: response.data.map((category) =>
            TransactionMapper.categoryToDto(category)
          ),
          meta: response.meta,
        };
      },
      this.contextName,
      "Failed to get paginated categories"
    );
  }

  async migrateTransactionCategoriesToCollection(): Promise<void> {
    return this.migrationService.migrateTransactionCategoriesToCollection();
  }

  async migrateTransactionAmountsToSignedAmounts(): Promise<void> {
    return this.migrationService.migrateTransactionAmountsToSignedAmounts();
  }
}
