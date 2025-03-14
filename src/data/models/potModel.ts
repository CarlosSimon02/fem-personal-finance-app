import { Timestamp } from "firebase-admin/firestore";

export type PotModel = {
  id: string;
  name: string;
  target: number | null;
  theme: string;
  totalSaved: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
};

export type CreatePotModel = Omit<
  PotModel,
  "id" | "createdAt" | "updatedAt" | "totalSaved"
> & {
  totalSaved?: number;
};

export type UpdatePotModel = Partial<
  Omit<PotModel, "id" | "createdAt" | "updatedAt" | "userId" | "totalSaved">
>;

export type MoneyOperationModel = {
  amount: number;
};
