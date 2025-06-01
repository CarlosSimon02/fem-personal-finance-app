export function debugLog(context: string, message: string, data?: unknown) {
  if (process.env.NODE_ENV === "development") {
    const logMessage = `[${context}]: ${message}`;
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }
}
