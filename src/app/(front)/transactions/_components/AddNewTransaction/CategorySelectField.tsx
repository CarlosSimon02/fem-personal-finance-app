"use client";

import { TransactionType } from "@/core/entities/TransactionEntity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { mockCategories } from "./constants";

interface CategorySelectFieldProps {
  value?: string;
  onChange: (categoryId: string) => void;
  transactionType: TransactionType;
  disabled?: boolean;
}

export const CategorySelectField = ({
  value,
  onChange,
  transactionType,
  disabled,
}: CategorySelectFieldProps) => (
  <Select disabled={disabled} onValueChange={onChange} value={value}>
    <SelectTrigger>
      <SelectValue placeholder="Select a category" />
    </SelectTrigger>
    <SelectContent>
      {transactionType &&
        mockCategories[transactionType].map((category) => (
          <SelectItem key={category.id} value={category.id}>
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span>{category.name}</span>
            </div>
          </SelectItem>
        ))}
    </SelectContent>
  </Select>
);
