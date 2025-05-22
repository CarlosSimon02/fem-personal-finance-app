import { CreateTransactionUseCase } from "@/core/useCases/transaction/createTransaction";
import { DeleteTransactionUseCase } from "@/core/useCases/transaction/deleteTransaction";
import { GetMultipleTransactionsUseCase } from "@/core/useCases/transaction/getMultipleTransactions";
import { GetTransactionUseCase } from "@/core/useCases/transaction/getTransaction";
import { UpdateTransactionUseCase } from "@/core/useCases/transaction/updateTransaction";
import { BudgetRepository } from "@/data/repositories/budgetRepository";
import { IncomeRepository } from "@/data/repositories/incomeRepository";
import { TransactionRepository } from "@/data/repositories/transactionRepository";

const transactionRepository = new TransactionRepository();
const budgetRepository = new BudgetRepository();
const incomeRepository = new IncomeRepository();

export const createTransactionUseCase = new CreateTransactionUseCase(
  transactionRepository,
  budgetRepository,
  incomeRepository
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
export const getMultipleTransactionsUseCase =
  new GetMultipleTransactionsUseCase(transactionRepository);

export { transactionRepository };
