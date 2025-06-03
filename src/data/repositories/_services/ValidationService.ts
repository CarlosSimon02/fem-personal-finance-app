import { z } from "zod";

export interface ValidationError extends Error {
  context: string;
  details: string;
}

export interface ValidationOptions {
  contextName: string;
  operationType: "create" | "update" | "read";
  documentId?: string;
}

export class ValidationService {
  /**
   * Validate input data using provided schema
   * @param schema - Zod schema for validation
   * @param input - Raw input data
   * @param options - Validation context information
   * @returns Validated data
   * @throws ValidationError with detailed context
   */
  validateInput<T>(
    schema: z.ZodType<T>,
    input: unknown,
    options: ValidationOptions
  ): T {
    try {
      return schema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorDetails = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");

        const validationError = new Error(
          `${options.contextName} ${options.operationType} input validation failed: ${errorDetails}`
        ) as ValidationError;

        validationError.context = options.contextName;
        validationError.details = errorDetails;

        throw validationError;
      }
      throw error;
    }
  }

  /**
   * Validate document data from database
   * @param schema - Zod schema for validation
   * @param rawData - Raw document data from Firestore
   * @param options - Validation context information
   * @returns Validated model data
   * @throws ValidationError with detailed context
   */
  validateDocumentData<T>(
    schema: z.ZodType<T>,
    rawData: unknown,
    options: ValidationOptions
  ): T {
    try {
      return schema.parse(rawData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorDetails = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");

        const context = options.documentId
          ? ` (Document ID: ${options.documentId})`
          : "";

        const validationError = new Error(
          `${options.contextName} data validation failed${context}: ${errorDetails}`
        ) as ValidationError;

        validationError.context = options.contextName;
        validationError.details = errorDetails;

        throw validationError;
      }
      throw error;
    }
  }

  /**
   * Validate with optional schema (fallback behavior)
   * @param schema - Optional Zod schema
   * @param input - Input data
   * @param options - Validation context
   * @returns Validated data or input as-is if no schema
   */
  validateOptional<T>(
    schema: z.ZodType<T> | undefined,
    input: unknown,
    options: ValidationOptions
  ): T {
    if (!schema) {
      return input as T; // Fallback to current behavior
    }
    return this.validateInput(schema, input, options);
  }
}
