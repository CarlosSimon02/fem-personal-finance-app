import { debugLog } from "@/utils/debugLog";

export interface ErrorContext {
  contextName: string;
  operationType: "create" | "read" | "update" | "delete" | "query";
  entityId?: string;
  userId?: string;
  additionalInfo?: Record<string, any>;
}

export class ErrorHandlingService {
  async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    customErrorMessage?: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const err = error as Error;
      const errorMessage =
        customErrorMessage ||
        `${context.contextName} ${context.operationType} operation failed`;

      debugLog(context.contextName, errorMessage, {
        error: err,
        operationType: context.operationType,
        entityId: context.entityId,
        userId: context.userId,
        ...context.additionalInfo,
      });

      throw new Error(`${errorMessage}: ${err.message}`);
    }
  }

  createValidationError(
    contextName: string,
    operationType: string,
    details: string,
    documentId?: string
  ): Error {
    const context = documentId ? ` (Document ID: ${documentId})` : "";
    return new Error(
      `${contextName} ${operationType} validation failed${context}: ${details}`
    );
  }

  createNotFoundError(contextName: string, entityId: string): Error {
    return new Error(`${contextName} with ID ${entityId} not found`);
  }

  createDuplicateError(
    contextName: string,
    field: string,
    value: string
  ): Error {
    return new Error(`${contextName} with ${field} '${value}' already exists`);
  }
}
