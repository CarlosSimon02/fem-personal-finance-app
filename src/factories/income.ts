import { CreateIncomeUseCase } from "@/core/useCases/income/createIncome";
import { DeleteIncomeUseCase } from "@/core/useCases/income/deleteIncome";
import { GetIncomeUseCase } from "@/core/useCases/income/getIncome";
import { GetPaginatedIncomesUseCase } from "@/core/useCases/income/getPaginatedIncomes";
import { GetPaginatedIncomesWithTransactionsUseCase } from "@/core/useCases/income/getPaginatedIncomesWithTransactions";
import { UpdateIncomeUseCase } from "@/core/useCases/income/updateIncome";
import { IncomeRepository } from "@/data/repositories/IncomeRepository";

const incomeRepository = new IncomeRepository();

export const createIncomeUseCase = new CreateIncomeUseCase(incomeRepository);
export const deleteIncomeUseCase = new DeleteIncomeUseCase(incomeRepository);
export const updateIncomeUseCase = new UpdateIncomeUseCase(incomeRepository);
export const getIncomeUseCase = new GetIncomeUseCase(incomeRepository);
export const getPaginatedIncomesUseCase = new GetPaginatedIncomesUseCase(
  incomeRepository
);
export const getPaginatedIncomesWithTransactionsUseCase =
  new GetPaginatedIncomesWithTransactionsUseCase(incomeRepository);

export { incomeRepository };
