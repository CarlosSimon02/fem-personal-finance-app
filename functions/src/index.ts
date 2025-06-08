import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";

// Import from your main src folder using the @ alias
import { debugLog } from "@/utils/debugLog";
// You can also import other utilities like:
// import { authError } from "@/utils/authError";

/**
 * Example cloud function that uses code from the main src folder
 */
export const exampleFunction = onRequest((request, response) => {
  // Using the debugLog utility from your main src folder
  debugLog(
    "This is a test from cloud functions",
    "This is a test from cloud functions"
  );

  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase! Using shared code from src folder.");
});

// You can import and use any of your shared code:
// - Schemas from @/core/schemas
// - Entities from @/core/entities
// - Utilities from @/utils
// - Interfaces from @/core/interfaces
