import { ZodError } from "zod";

type FieldErrors = {
  [x: string]: string[] | undefined;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
};

const getValidationErrors = (error: unknown): FieldErrors | undefined => {
  if (error instanceof ZodError) {
    return error.flatten().fieldErrors;
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
