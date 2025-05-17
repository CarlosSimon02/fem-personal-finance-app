import { ValidationError } from "./validationError";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
};

const getValidationErrors = (
  error: unknown
): Record<string, string | undefined> | undefined => {
  if (error instanceof ValidationError) {
    return error.errors;
  }
  return undefined;
};

const getServerActionError = (error: unknown) => {
  return {
    data: null,
    error: getErrorMessage(error),
    validationErrors: getValidationErrors(error),
  };
};

export default getServerActionError;
