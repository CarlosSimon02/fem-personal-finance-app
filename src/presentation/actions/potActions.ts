"use server";

import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  CreatePotDto,
  PaginatedPotsResponseDto,
  PotDto,
  UpdatePotDto,
} from "@/core/schemas/potSchema";
import {
  createPotUseCase,
  deletePotUseCase,
  getPaginatedPotsUseCase,
  updatePotUseCase,
} from "@/factories/pot";
import { actionWithAuth } from "@/utils/actionWithAuth";
import { cacheTags } from "@/utils/cacheTags";
import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";

export const createPotAction = actionWithAuth<CreatePotDto, PotDto>(
  async ({ user, data }) => {
    const pot = await createPotUseCase.execute(user.id, data);
    return { data: pot, error: null };
  }
);

export const deletePotAction = actionWithAuth<string, void>(
  async ({ user, data }) => {
    await deletePotUseCase.execute(user.id, data);
    return { data: undefined, error: null };
  }
);

export const updatePotAction = actionWithAuth<
  { id: string; data: UpdatePotDto },
  PotDto
>(async ({ user, data }) => {
  const pot = await updatePotUseCase.execute(user.id, data.id, data.data);
  return { data: pot, error: null };
});

export const getPaginatedPotsAction = actionWithAuth<
  PaginationParams,
  PaginatedPotsResponseDto
>(async ({ user, data }) => {
  "use cache";
  cacheTag(cacheTags.PAGINATED_POTS);

  const response = await getPaginatedPotsUseCase.execute(user.id, data);
  return { data: response, error: null };
});

export const revalidatePotTags = async () => {
  revalidateTag(cacheTags.PAGINATED_POTS);
};
