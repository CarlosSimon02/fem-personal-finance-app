import { UserEntity } from "@/core/entities/UserEntity";
import { DecodedIdToken } from "firebase-admin/auth";

export function tokensToAuthUser(decodedToken: DecodedIdToken): UserEntity {
  const { uid, email, picture, name } = decodedToken;

  return {
    uid: uid,
    email: email!,
    displayName: name,
    photoURL: picture,
  };
}
