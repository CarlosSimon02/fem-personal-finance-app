import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const zTimestamp = z.custom<Timestamp>(
  (value) => value instanceof Timestamp,
  {
    message: "Invalid Firestore Timestamp",
  }
);

export const zFieldValue = z.custom<FieldValue>(
  (value) => value instanceof FieldValue,
  {
    message: "Invalid Firestore FieldValue",
  }
);
