import { AddMoneyToPotUseCase } from "@/core/useCases/pot/addMoneyToPot";
import { CreatePotUseCase } from "@/core/useCases/pot/createPot";
import { DeletePotUseCase } from "@/core/useCases/pot/deletePot";
import { GetPaginatedPotsUseCase } from "@/core/useCases/pot/getPaginatedPots";
import { GetPotUseCase } from "@/core/useCases/pot/getPot";
import { UpdatePotUseCase } from "@/core/useCases/pot/updatePot";
import { WithdrawMoneyFromPotUseCase } from "@/core/useCases/pot/withdrawMoneyFromPot";
import { PotRepository } from "@/data/repositories/potRepository";

const potRepository = new PotRepository();

export const createPotUseCase = new CreatePotUseCase(potRepository);
export const deletePotUseCase = new DeletePotUseCase(potRepository);
export const updatePotUseCase = new UpdatePotUseCase(potRepository);
export const getPotUseCase = new GetPotUseCase(potRepository);
export const getPaginatedPotsUseCase = new GetPaginatedPotsUseCase(
  potRepository
);
export const addMoneyToPotUseCase = new AddMoneyToPotUseCase(potRepository);
export const withdrawMoneyFromPotUseCase = new WithdrawMoneyFromPotUseCase(
  potRepository
);

export { potRepository };
