import { TransactionDto } from "@/core/schemas/transactionSchema";
import {
  EntityType,
  RealtimeListenerService,
} from "@/presentation/services/realtimeListenerService";
import { AuthError } from "@/utils/authError";

export class SubscribeToTransactionsUseCase {
  private realtimeService: RealtimeListenerService;

  constructor() {
    this.realtimeService = RealtimeListenerService.getInstance();
  }

  execute(
    userId: string,
    onData: (data: TransactionDto[]) => void,
    onError: (error: Error) => void
  ): () => void {
    if (!userId) {
      throw new AuthError();
    }

    return this.realtimeService.subscribe<TransactionDto>({
      userId,
      entityType: "transactions" as EntityType,
      onData,
      onError,
    });
  }
}
