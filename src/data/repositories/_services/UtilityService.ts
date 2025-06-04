import { debugLog } from "@/utils/debugLog";
import { nanoid } from "nanoid";

export class UtilityService {
  generateId(size: number = 10): string {
    return nanoid(size);
  }

  async executeOperation<T>(
    operation: () => Promise<T>,
    contextName: string,
    errorMessage: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const err = error as Error;
      debugLog(contextName, errorMessage, err);
      throw new Error(`${errorMessage}: ${err.message}`);
    }
  }
}
