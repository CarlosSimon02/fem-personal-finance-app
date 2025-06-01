import { TransactionCategory } from "@/core/schemas/transactionSchema";
import {
  CreateTransactionModel,
  UpdateTransactionModel,
} from "@/data/models/transactionModel";
import { FieldValue } from "firebase-admin/firestore";
import { BatchOperationService } from "../_utils";

export class TransactionBatchService extends BatchOperationService {
  addTransactionCreate(
    ref: FirebaseFirestore.DocumentReference,
    data: CreateTransactionModel
  ): TransactionBatchService {
    this.set(ref, data);
    return this;
  }

  addTransactionUpdate(
    ref: FirebaseFirestore.DocumentReference,
    data: UpdateTransactionModel
  ): TransactionBatchService {
    this.update(ref, data);
    return this;
  }

  async addCategoryIfNotExists(
    ref: FirebaseFirestore.DocumentReference,
    category: TransactionCategory,
    timestamp: FieldValue
  ): Promise<TransactionBatchService> {
    await this.setIfNotExists(ref, {
      id: category.id,
      name: category.name,
      colorTag: category.colorTag,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    return this;
  }

  addCategoryDelete(
    ref: FirebaseFirestore.DocumentReference,
    condition: boolean
  ): TransactionBatchService {
    this.conditionalDelete(ref, condition);
    return this;
  }
}
