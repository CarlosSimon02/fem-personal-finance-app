import {
  CreateUserModel,
  createUserModelSchema,
  UpdateUserModel,
  updateUserModelSchema,
  UserModel,
  userModelSchema,
} from "../models/userModel";
import { CollectionService } from "../services/CollectionService";
import { ValidationService } from "../services/ValidationService";

export class UserDatasource {
  private readonly collectionService: CollectionService;
  private readonly validationService: ValidationService;
  constructor() {
    this.collectionService = new CollectionService();
    this.validationService = new ValidationService();
  }

  getUserCollection() {
    return this.collectionService.getUserCollection();
  }

  async getById(id: string): Promise<UserModel | null> {
    const userCollection = this.getUserCollection();
    const userDoc = await userCollection.doc(id).get();

    if (!userDoc.exists) {
      return null;
    }

    const user = userDoc.data();
    const validatedUser = this.validationService.validateDocumentData(
      userModelSchema,
      user,
      {
        contextName: "UserDatasource",
        operationType: "read",
      }
    );

    return validatedUser;
  }

  async createOne(user: CreateUserModel) {
    const userCollection = this.getUserCollection();
    const validatedUser = this.validationService.validateDocumentData(
      createUserModelSchema,
      user,
      {
        contextName: "UserDatasource",
        operationType: "create",
      }
    );

    const userDoc = userCollection.doc(validatedUser.id);
    await userDoc.set(validatedUser);
  }

  async updateOne(id: string, data: UpdateUserModel) {
    const userCollection = this.getUserCollection();
    const validatedData = this.validationService.validateDocumentData(
      updateUserModelSchema,
      data,
      {
        contextName: "UserDatasource",
        operationType: "update",
      }
    );
    const userDoc = userCollection.doc(id);
    await userDoc.update(validatedData);
  }

  async deleteOne(id: string) {
    const userCollection = this.getUserCollection();
    const userDoc = userCollection.doc(id);
    await userDoc.delete();
  }
}
