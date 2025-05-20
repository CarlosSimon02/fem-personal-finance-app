import { ValidationError } from "@/utils/validationError";
import { ZodError } from "zod";
import { CreateBudgetDto, createBudgetSchema } from "../schemas/budgetSchema";

export class BudgetEntity {
  private id?: string;
  private name?: string;
  private maximumSpending?: number;
  private colorTag?: string;
  private createdAt?: Date;
  private updatedAt?: Date;
  private userId?: string;

  constructor({
    id,
    name,
    maximumSpending,
    colorTag,
    createdAt,
    updatedAt,
    userId,
  }: {
    id?: string;
    name?: string;
    maximumSpending?: number;
    colorTag?: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId?: string;
  }) {
    this.id = id;
    this.name = name;
    this.maximumSpending = maximumSpending;
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

  getMaximumSpending() {
    return this.maximumSpending;
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

  setMaximumSpending(maximumSpending: number) {
    this.maximumSpending = maximumSpending;
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

  validateCreateBudget() {
    try {
      return createBudgetSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      throw new ValidationError(
        {
          name: errors.name?.[0],
          maximumSpending: errors.maximumSpending?.[0],
          colorTag: errors.colorTag?.[0],
        } satisfies AllUnknown<CreateBudgetDto>,
        "Invalid budget data"
      );
    }
  }
}
