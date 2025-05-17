export class ValidationError extends Error {
  errors: Record<string, string | undefined>;

  constructor(errors: Record<string, string | undefined>, message: string) {
    super(message || "An validation error occured");
    this.errors = errors;
  }

  getErrors() {
    return this.errors;
  }
}
