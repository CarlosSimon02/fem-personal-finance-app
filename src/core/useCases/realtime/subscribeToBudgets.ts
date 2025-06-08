import { BudgetDto } from "@/core/schemas/budgetSchema";
import {
  EntityType,
  RealtimeListenerService,
} from "@/presentation/services/realtimeListenerService";
import { AuthError } from "@/utils/authError";

export class SubscribeToBudgetsUseCase {
  private realtimeService: RealtimeListenerService;

  constructor() {
    this.realtimeService = RealtimeListenerService.getInstance();
  }

  execute(
    userId: string,
    onData: (data: BudgetDto[]) => void,
    onError: (error: Error) => void
  ): () => void {
    if (!userId) {
      throw new AuthError();
    }

    return this.realtimeService.subscribe<BudgetDto>({
      userId,
      entityType: "budgets" as EntityType,
      onData,
      onError,
    });
  }
}
