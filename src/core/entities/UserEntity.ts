import { ValidationError } from "@/utils/validationError";
import { ZodError } from "zod";
import { createUserSchema } from "../schemas/userSchema";

export class UserEntity {
  private id?: string;
  private email?: string;
  private displayName?: string | null;
  private photoURL?: string | null;
  private phoneNumber?: string | null;
  private createdAt?: Date;
  private updatedAt?: Date;
  private customClaims?: Record<string, unknown> | null;

  constructor({
    id,
    email,
    displayName,
    photoURL,
    phoneNumber,
    createdAt,
    updatedAt,
    customClaims,
  }: {
    id?: string;
    email?: string;
    displayName?: string | null;
    photoURL?: string | null;
    phoneNumber?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    customClaims?: Record<string, unknown> | null;
  }) {
    this.id = id;
    this.email = email;
    this.displayName = displayName;
    this.photoURL = photoURL;
    this.phoneNumber = phoneNumber;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.customClaims = customClaims;
  }

  getId() {
    return this.id;
  }

  getEmail() {
    return this.email;
  }

  getDisplayName() {
    return this.displayName;
  }

  getPhotoURL() {
    return this.photoURL;
  }

  getPhoneNumber() {
    return this.phoneNumber;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  getCustomClaims() {
    return this.customClaims;
  }

  setId(id: string) {
    this.id = id;
  }

  setEmail(email: string) {
    this.email = email;
  }

  setDisplayName(displayName: string) {
    this.displayName = displayName;
  }

  setPhotoURL(photoURL: string) {
    this.photoURL = photoURL;
  }

  setPhoneNumber(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
  }

  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }

  setCustomClaims(customClaims: Record<string, unknown>) {
    this.customClaims = customClaims;
  }

  validateCreateUser() {
    try {
      return createUserSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      throw new ValidationError(
        {
          email: errors.email?.[0],
          displayName: errors.displayName?.[0],
          photoURL: errors.photoURL?.[0],
          phoneNumber: errors.phoneNumber?.[0],
        },
        "Invalid user data"
      );
    }
  }
}
