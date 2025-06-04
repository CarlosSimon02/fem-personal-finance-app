import { UserDto } from "@/core/schemas/userSchema";
import { UserModel } from "@/data/models/userModel";
import { UserRecord } from "firebase-admin/auth";

export class UserMapper {
  static userRecordToDto(user: UserRecord): UserDto {
    return {
      id: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? undefined,
      photoURL: user.photoURL ?? undefined,
      phoneNumber: user.phoneNumber ?? undefined,
      createdAt: new Date(user.metadata.creationTime),
      updatedAt: new Date(user.metadata.lastSignInTime),
      customClaims: user.customClaims ?? {},
    };
  }

  static toDto(user: UserModel): UserDto {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt.toDate(),
      updatedAt: user.updatedAt.toDate(),
      customClaims: user.customClaims,
    };
  }
}
