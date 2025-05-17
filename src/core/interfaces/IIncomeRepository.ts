import {
  CreateIncomeDto,
  IncomeDto,
  UpdateIncomeDto,
} from "@/core/schemas/incomeSchema";

export interface IIncomeRepository {
  createIncome(input: CreateIncomeDto): Promise<IncomeDto>;
  getIncome(userId: string, incomeId: string): Promise<IncomeDto | null>;
  getAllIncomes(userId: string): Promise<IncomeDto[]>;
  updateIncome(
    userId: string,
    incomeId: string,
    input: UpdateIncomeDto
  ): Promise<IncomeDto>;
  deleteIncome(userId: string, incomeId: string): Promise<void>;
}
