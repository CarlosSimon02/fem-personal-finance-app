"use server";

import { PaginatedBudgetsResponse } from "@/core/schemas/budgetSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { getPaginatedBudgetsUseCase } from "@/factories/budget";
import { actionWithAuth } from "@/utils/actionWithAuth";

const getPaginatedBudgetsAction = actionWithAuth<
  PaginationParams,
  PaginatedBudgetsResponse
>(async ({ user, data }) => {
  const response = await getPaginatedBudgetsUseCase.execute(user.id, data);
  return { data: response, error: null };
});

export default getPaginatedBudgetsAction;
