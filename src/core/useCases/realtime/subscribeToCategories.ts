import { CategoryDto } from "@/core/schemas/categorySchema";
import {
  EntityType,
  RealtimeListenerService,
} from "@/presentation/services/realtimeListenerService";
import { AuthError } from "@/utils/authError";

export class SubscribeToCategoriesUseCase {
  private realtimeService: RealtimeListenerService;

  constructor() {
    this.realtimeService = RealtimeListenerService.getInstance();
  }

  execute(
    userId: string,
    onData: (data: CategoryDto[]) => void,
    onError: (error: Error) => void
  ): () => void {
    if (!userId) {
      throw new AuthError();
    }

    return this.realtimeService.subscribe<CategoryDto>({
      userId,
      entityType: "categories" as EntityType,
      onData,
      onError,
    });
  }
}
