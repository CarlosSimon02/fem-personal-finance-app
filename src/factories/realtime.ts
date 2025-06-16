import { SubscribeToBudgetsUseCase } from "@/core/useCases/realtime/subscribeToBudgets";
import { SubscribeToCategoriesUseCase } from "@/core/useCases/realtime/subscribeToCategories";
import { SubscribeToIncomesUseCase } from "@/core/useCases/realtime/subscribeToIncomes";
import { SubscribeToPotsUseCase } from "@/core/useCases/realtime/subscribeToPots";
import { SubscribeToTransactionsUseCase } from "@/core/useCases/realtime/subscribeToTransactions";

export const subscribeToTransactionsUseCase =
  new SubscribeToTransactionsUseCase();
export const subscribeToCategoriesUseCase = new SubscribeToCategoriesUseCase();
export const subscribeToBudgetsUseCase = new SubscribeToBudgetsUseCase();
export const subscribeToIncomesUseCase = new SubscribeToIncomesUseCase();
export const subscribeToPotsUseCase = new SubscribeToPotsUseCase();
