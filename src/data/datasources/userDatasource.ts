import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { UserModel, UserUpdateModel } from "../models/userModel";

export class UserDatasource {
  private readonly usersCollection = adminFirestore.collection("users");

  async createUser(user: UserModel): Promise<UserModel> {
    try {
      await this.usersCollection.doc(user.id).set({
        ...user,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      return user;
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to create user: " + err.message);
    }
  }

  async getUserById(uid: string): Promise<UserModel | null> {
    try {
      const doc = await this.usersCollection.doc(uid).get();
      return doc.exists ? (doc.data() as UserModel) : null;
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to fetch user: " + err.message);
    }
  }

  async updateUser(uid: string, updates: UserUpdateModel): Promise<void> {
    try {
      await this.usersCollection
        .doc(uid)
        .update({ ...updates, updatedAt: FieldValue.serverTimestamp() });
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to update user: " + err.message);
    }
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      await this.usersCollection.doc(uid).delete();
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to delete user: " + err.message);
    }
  }

  async getAllUsers(): Promise<UserModel[]> {
    try {
      const snapshot = await this.usersCollection.get();
      return snapshot.docs.map((doc) => doc.data() as UserModel);
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to fetch users: " + err.message);
    }
  }
}
