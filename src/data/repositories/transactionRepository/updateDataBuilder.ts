import { TransactionType } from "@/core/schemas/transactionSchema";

import { Timestamp } from "firebase-admin/firestore";

import { TransactionCategory } from "@/core/schemas/transactionSchema";
import { UpdateTransactionModel } from "@/data/models/transactionModel";
import { FieldValue } from "firebase-admin/firestore";

export class UpdateDataBuilder {
  private updateData: UpdateTransactionModel = {
    updatedAt: FieldValue.serverTimestamp(),
  };

  static create(): UpdateDataBuilder {
    return new UpdateDataBuilder();
  }

  addFieldIfChanged<T>(
    newValue: T | undefined,
    currentValue: T,
    fieldName: keyof UpdateTransactionModel,
    transformer?: (
      value: T
    ) => FieldValue | Timestamp | TransactionCategory | string | number | null
  ): UpdateDataBuilder {
    if (newValue !== undefined && newValue !== currentValue) {
      (this.updateData as Record<string, unknown>)[fieldName] = transformer
        ? transformer(newValue)
        : newValue;
    }
    return this;
  }

  addSignedAmountIfNeeded(
    amount: number | undefined,
    type: TransactionType | undefined,
    currentAmount: number,
    currentType: TransactionType
  ): UpdateDataBuilder {
    if (amount !== undefined && amount !== currentAmount) {
      const finalType = type ?? currentType;
      this.updateData.signedAmount = finalType === "income" ? amount : -amount;
    }
    return this;
  }

  build(): UpdateTransactionModel {
    return this.updateData;
  }
}
