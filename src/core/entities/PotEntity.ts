import { ValidationError } from "@/utils/validationError";
import { ZodError } from "zod";
import { CreatePotDto, createPotSchema } from "../schemas/potSchema";

export class PotEntity {
  private id?: string;
  private name?: string;
  private colorTag?: string;
  private target?: number;
  private totalSaved?: number;
  private createdAt?: Date;
  private updatedAt?: Date;
  private userId?: string;

  constructor({
    id,
    name,
    colorTag,
    target,
    totalSaved,
    createdAt,
    updatedAt,
    userId,
  }: {
    id?: string;
    name?: string;
    colorTag?: string;
    target?: number;
    totalSaved?: number;
    createdAt?: Date;
    updatedAt?: Date;
    userId?: string;
  }) {
    this.id = id;
    this.name = name;
    this.colorTag = colorTag;
    this.target = target;
    this.totalSaved = totalSaved;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userId = userId;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getColorTag() {
    return this.colorTag;
  }

  getTarget() {
    return this.target;
  }

  getTotalSaved() {
    return this.totalSaved;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  getUserId() {
    return this.userId;
  }

  setId(id: string) {
    this.id = id;
  }

  setName(name: string) {
    this.name = name;
  }

  setColorTag(colorTag: string) {
    this.colorTag = colorTag;
  }

  setTarget(target: number) {
    this.target = target;
  }

  setTotalSaved(totalSaved: number) {
    this.totalSaved = totalSaved;
  }

  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  validateCreatePot() {
    try {
      return createPotSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      throw new ValidationError(
        {
          name: errors.name?.[0],
          colorTag: errors.colorTag?.[0],
          target: errors.target?.[0],
        } satisfies AllUnknown<CreatePotDto>,
        "Invalid pot data"
      );
    }
  }
}
