"use server";

import { CreateIncomeDto, IncomeDto } from "@/core/schemas/incomeSchema";
import { createIncomeUseCase } from "@/factories/income";
import { actionWithAuth } from "@/utils/actionWithAuth";

const createIncomeAction = actionWithAuth<CreateIncomeDto, IncomeDto>(
  async ({ user, data }) => {
    const income = await createIncomeUseCase.execute(user.id, data);
    return { data: income, error: null };
  }
);

export default createIncomeAction;
