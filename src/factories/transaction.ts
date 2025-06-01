import { CreateTransactionUseCase } from "@/core/useCases/transaction/createTransaction";
import { DeleteTransactionUseCase } from "@/core/useCases/transaction/deleteTransaction";
import { GetPaginatedCategoriesUseCase } from "@/core/useCases/transaction/getPaginatedCategories";
import { GetPaginatedTransactionsUseCase } from "@/core/useCases/transaction/getPaginatedTransactions";
import { GetTransactionUseCase } from "@/core/useCases/transaction/getTransaction";
import { UpdateTransactionUseCase } from "@/core/useCases/transaction/updateTransaction";
import { TransactionRepository } from "@/data/repositories/transactionRepository";

const transactionRepository = new TransactionRepository();

export const createTransactionUseCase = new CreateTransactionUseCase(
  transactionRepository
);
export const deleteTransactionUseCase = new DeleteTransactionUseCase(
  transactionRepository
);
export const updateTransactionUseCase = new UpdateTransactionUseCase(
  transactionRepository
);
export const getTransactionUseCase = new GetTransactionUseCase(
  transactionRepository
);
export const getPaginatedTransactionsUseCase =
  new GetPaginatedTransactionsUseCase(transactionRepository);

export const getPaginatedCategoriesUseCase = new GetPaginatedCategoriesUseCase(
  transactionRepository
);

export { transactionRepository };
