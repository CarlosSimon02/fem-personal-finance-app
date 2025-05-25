"use server";

import { PaginatedIncomesResponse } from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { getPaginatedIncomesUseCase } from "@/factories/income";
import { actionWithAuth } from "@/utils/actionWithAuth";

const getPaginatedIncomesAction = actionWithAuth<
  PaginationParams,
  PaginatedIncomesResponse
>(async ({ user, data }) => {
  const response = await getPaginatedIncomesUseCase.execute(user.id, data);
  return { data: response, error: null };
});

export default getPaginatedIncomesAction;
