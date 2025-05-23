import {
  CreateIncomeDto,
  createIncomeSchema,
} from "@/core/schemas/incomeSchema";
import { ValidationError } from "@/utils/validationError";
import { ZodError } from "zod";

export class IncomeEntity {
  private id?: string;
  private name?: string;
  private colorTag?: string;
  private createdAt?: Date;
  private updatedAt?: Date;
  private userId?: string;

  constructor({
    id,
    name,
    colorTag,
    createdAt,
    updatedAt,
    userId,
  }: {
    id?: string;
    name?: string;
    colorTag?: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId?: string;
  }) {
    this.id = id;
    this.name = name;
    this.colorTag = colorTag;
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

  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  validateCreateIncome() {
    try {
      return createIncomeSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      throw new ValidationError(
        {
          name: errors.name?.[0],
          colorTag: errors.colorTag?.[0],
        } satisfies AllUnknown<CreateIncomeDto>,
        "Invalid income data"
      );
    }
  }
}
