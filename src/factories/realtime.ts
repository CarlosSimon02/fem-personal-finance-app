import { SubscribeToBudgetsUseCase } from "@/core/useCases/realtime/subscribeToBudgets";
import { SubscribeToIncomesUseCase } from "@/core/useCases/realtime/subscribeToIncomes";
import { SubscribeToTransactionsUseCase } from "@/core/useCases/realtime/subscribeToTransactions";

export const subscribeToTransactionsUseCase =
  new SubscribeToTransactionsUseCase();
export const subscribeToBudgetsUseCase = new SubscribeToBudgetsUseCase();
export const subscribeToIncomesUseCase = new SubscribeToIncomesUseCase();
