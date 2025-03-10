import { Timestamp } from "firebase-admin/firestore";

export interface UserModel {
  uid: string;
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
  "uid" | "email" | "createdAt" | "updatedAt"
>;
