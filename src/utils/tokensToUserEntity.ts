import { UserEntity } from "@/core/entities/UserEntity";
import { DecodedIdToken } from "firebase-admin/auth";

export function tokensToUserEntity(decodedToken: DecodedIdToken): UserEntity {
  const { uid, email, picture, name } = decodedToken;

  return {
    id: uid,
    email: email!,
    displayName: name,
    photoURL: picture,
  };
}
