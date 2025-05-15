import { CreateTransactionUseCase } from "@/core/useCases/transaction/createTransaction";
import { DeleteTransactionUseCase } from "@/core/useCases/transaction/deleteTransaction";
import { GetTransactionUseCase } from "@/core/useCases/transaction/getTransaction";
import { UpdateTransactionUseCase } from "@/core/useCases/transaction/updateTransaction";
import { TransactionAdminDatasource } from "@/data/datasources/transactionDatasource";
import { TransactionRepository } from "@/data/repositories/transactionRepository";

const transactionDatasource = new TransactionAdminDatasource();
const transactionRepository = new TransactionRepository(transactionDatasource);

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
export const getMultipleTransactionsUseCase =
  new GetMultipleTransactionsUseCase(transactionRepository);

export { transactionDatasource, transactionRepository };
