"use server";

import { BudgetDto, CreateBudgetDto } from "@/core/schemas/budgetSchema";
import { createBudgetUseCase } from "@/factories/budget";
import { actionWithAuth } from "@/utils/actionWithAuth";

const createBudgetAction = actionWithAuth<CreateBudgetDto, BudgetDto>(
  async ({ user, data }) => {
    const budget = await createBudgetUseCase.execute(user.id, data);
    return { data: budget, error: null };
  }
);

export default createBudgetAction;
