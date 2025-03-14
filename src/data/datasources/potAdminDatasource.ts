import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import {
  CreatePotModel,
  MoneyOperationModel,
  PotModel,
  UpdatePotModel,
} from "../models/potModel";

export class PotAdminDatasource {
  private getPotCollection(userId: string) {
    return adminFirestore.collection("users").doc(userId).collection("pots");
  }

  async createPot(userId: string, data: CreatePotModel): Promise<PotModel> {
    try {
      const potRef = this.getPotCollection(userId).doc();
      const timestamp = FieldValue.serverTimestamp();

      const potData = {
        ...data,
        id: potRef.id,
        totalSaved: data.totalSaved || 0,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await potRef.set(potData);
      const potDoc = await potRef.get();
      const docData = potDoc.data();

      if (!docData) throw new Error("Pot not found after creation");

      return {
        ...docData,
        id: potDoc.id,
        createdAt: docData.createdAt as Timestamp,
        updatedAt: docData.updatedAt as Timestamp,
      } as PotModel;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to create pot: ${err.message}`);
    }
  }

  async getPot(userId: string, potId: string): Promise<PotModel> {
    try {
      const potDoc = await this.getPotCollection(userId).doc(potId).get();
      if (!potDoc.exists) throw new Error("Pot not found");

      return {
        ...potDoc.data(),
        id: potDoc.id,
      } as PotModel;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get pot: ${err.message}`);
    }
  }

  async getAllPots(userId: string): Promise<PotModel[]> {
    try {
      const potsQuery = this.getPotCollection(userId).orderBy("name", "asc");
      const potDocs = await potsQuery.get();

      return potDocs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as PotModel[];
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get pots: ${err.message}`);
    }
  }

  async updatePot(
    userId: string,
    potId: string,
    data: UpdatePotModel
  ): Promise<PotModel> {
    try {
      const potRef = this.getPotCollection(userId).doc(potId);
      const timestamp = FieldValue.serverTimestamp();

      await potRef.update({
        ...data,
        updatedAt: timestamp,
      });

      const updatedDoc = await potRef.get();
      if (!updatedDoc.exists) throw new Error("Pot not found after update");

      return {
        ...updatedDoc.data(),
        id: updatedDoc.id,
      } as PotModel;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to update pot: ${err.message}`);
    }
  }

  async deletePot(userId: string, potId: string): Promise<void> {
    try {
      await this.getPotCollection(userId).doc(potId).delete();
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to delete pot: ${err.message}`);
    }
  }

  async addMoneyToPot(
    userId: string,
    potId: string,
    data: MoneyOperationModel
  ): Promise<PotModel> {
    try {
      const potRef = this.getPotCollection(userId).doc(potId);
      await potRef.update({
        totalSaved: FieldValue.increment(data.amount),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const updatedDoc = await potRef.get();
      if (!updatedDoc.exists)
        throw new Error("Pot not found after adding money");

      return {
        ...updatedDoc.data(),
        id: updatedDoc.id,
      } as PotModel;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to add money to pot: ${err.message}`);
    }
  }

  async withdrawMoneyFromPot(
    userId: string,
    potId: string,
    data: MoneyOperationModel
  ): Promise<PotModel> {
    try {
      const potRef = this.getPotCollection(userId).doc(potId);
      const potDoc = await potRef.get();

      if (!potDoc.exists) throw new Error("Pot not found");

      const currentTotalSaved = potDoc.data()?.totalSaved as number;
      if (currentTotalSaved < data.amount) {
        throw new Error("Insufficient funds in pot");
      }

      await adminFirestore.runTransaction(async (transaction) => {
        transaction.update(potRef, {
          totalSaved: FieldValue.increment(-data.amount),
          updatedAt: FieldValue.serverTimestamp(),
        });
      });

      const updatedDoc = await potRef.get();
      return {
        ...updatedDoc.data(),
        id: updatedDoc.id,
      } as PotModel;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to withdraw money from pot: ${err.message}`);
    }
  }
}
