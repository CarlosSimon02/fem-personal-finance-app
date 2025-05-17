export class AuthError extends Error {
  constructor() {
    super("You must be authenticated to do this action");
  }
}
