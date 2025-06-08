import { IncomeDto } from "@/core/schemas/incomeSchema";
import {
  EntityType,
  RealtimeListenerService,
} from "@/presentation/services/realtimeListenerService";
import { AuthError } from "@/utils/authError";

export class SubscribeToIncomesUseCase {
  private realtimeService: RealtimeListenerService;

  constructor() {
    this.realtimeService = RealtimeListenerService.getInstance();
  }

  execute(
    userId: string,
    onData: (data: IncomeDto[]) => void,
    onError: (error: Error) => void
  ): () => void {
    if (!userId) {
      throw new AuthError();
    }

    return this.realtimeService.subscribe<IncomeDto>({
      userId,
      entityType: "incomes" as EntityType,
      onData,
      onError,
    });
  }
}
