import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export const zTimestamp = z
  .custom<Timestamp>(
    (value) => {
      if (value instanceof Timestamp) return true;
      if (typeof value === "number" && value > 0) return true;
      if (typeof value === "string" && !isNaN(Date.parse(value))) return true;
      return false;
    },
    { message: "Expected Timestamp, Unix seconds, or ISO string" }
  )
  .transform((value) => {
    if (typeof value === "number") {
      // Handle both seconds and milliseconds
      const seconds = value > 1e12 ? Math.floor(value / 1000) : value;
      return new Timestamp(seconds, 0);
    }
    if (typeof value === "string") {
      return Timestamp.fromDate(new Date(value));
    }
    return value; // Already a Timestamp
  });

export const zFieldValue = z.custom<FieldValue>(
  (value) => value instanceof FieldValue,
  {
    message: "Invalid Firestore FieldValue",
  }
);
