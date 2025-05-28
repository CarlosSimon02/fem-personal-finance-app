"use server";

import {
  IncomeDto,
  PaginatedIncomesResponse,
} from "@/core/schemas/incomeSchema";

import { CreateIncomeDto } from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  createIncomeUseCase,
  getPaginatedIncomesUseCase,
} from "@/factories/income";
import { actionWithAuth } from "@/utils/actionWithAuth";

export const createIncomeAction = actionWithAuth<CreateIncomeDto, IncomeDto>(
  async ({ user, data }) => {
    const income = await createIncomeUseCase.execute(user.id, data);
    return { data: income, error: null };
  }
);

export const getPaginatedIncomesAction = actionWithAuth<
  PaginationParams,
  PaginatedIncomesResponse
>(async ({ user, data }) => {
  const response = await getPaginatedIncomesUseCase.execute(user.id, data);
  return { data: response, error: null };
});
