import { Timestamp } from "firebase-admin/firestore";

export interface UserModel {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  customClaims: Record<string, unknown> | null;
}

export type UserUpdateModel = Omit<
  UserModel,
  "id" | "email" | "createdAt" | "updatedAt"
>;
