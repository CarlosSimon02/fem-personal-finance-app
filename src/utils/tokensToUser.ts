import { User } from "@/core/schemas/userSchema";
import { DecodedIdToken } from "firebase-admin/auth";

export function tokensToUser(decodedToken: DecodedIdToken): User {
  const { uid, email, picture, name } = decodedToken;

  return {
    id: uid,
    email: email!,
    displayName: name,
    photoURL: picture,
  };
}
