import { BudgetEntity } from "@/core/entities/BudgetEntity";
import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { CreateBudgetDto, UpdateBudgetDto } from "@/core/schemas/budgetSchema";
import { BudgetDatasource } from "../datasources/budgetDatasource";
import { BudgetModel } from "../models/budgetModel";

export class BudgetRepository implements IBudgetRepository {
  constructor(private budgetDatasource: BudgetDatasource) {}

  async createBudget(input: CreateBudgetDto): Promise<BudgetEntity> {
    const budget = await this.budgetDatasource.createBudget(input.userId, {
      name: input.name,
      maximumSpending: input.maximumSpending,
      colorTag: input.colorTag,
      userId: input.userId,
    });

    return this.mapBudgetModelToEntity(budget);
  }

  async getBudget(userId: string, budgetId: string): Promise<BudgetEntity> {
    const budget = await this.budgetDatasource.getBudget(userId, budgetId);
    return this.mapBudgetModelToEntity(budget);
  }

  async getAllBudgets(userId: string): Promise<BudgetEntity[]> {
    const budgets = await this.budgetDatasource.getAllBudgets(userId);
    return budgets.map((budget) => this.mapBudgetModelToEntity(budget));
  }

  async updateBudget(
    userId: string,
    budgetId: string,
    input: UpdateBudgetDto
  ): Promise<BudgetEntity> {
    const budget = await this.budgetDatasource.updateBudget(
      userId,
      budgetId,
      input
    );

    return this.mapBudgetModelToEntity(budget);
  }

  async deleteBudget(userId: string, budgetId: string): Promise<void> {
    await this.budgetDatasource.deleteBudget(userId, budgetId);
  }

  private mapBudgetModelToEntity(budget: BudgetModel): BudgetEntity {
    return {
      id: budget.id,
      name: budget.name,
      maximumSpending: budget.maximumSpending,
      colorTag: budget.colorTag,
      createdAt: budget.createdAt ? budget.createdAt.toDate() : undefined,
      updatedAt: budget.updatedAt ? budget.updatedAt.toDate() : undefined,
      userId: budget.userId,
    };
  }
}
