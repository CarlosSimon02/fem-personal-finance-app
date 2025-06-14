"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/presentation/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/presentation/components/ui/form";
import { Input } from "@/presentation/components/ui/input";

import {
  BudgetDto,
  CreateBudgetDto,
  createBudgetSchema,
} from "@/core/schemas/budgetSchema";
import ColorPicker from "../../ui/color-picker";
import { DialogFooter } from "../../ui/dialog";

interface BudgetFormProps {
  onSubmit: (data: CreateBudgetDto) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  operation: "create" | "update";
  initialData?: BudgetDto;
}

export const BudgetForm = ({
  onSubmit,
  onCancel,
  isSubmitting,
  operation,
  initialData,
}: BudgetFormProps) => {
  const form = useForm<CreateBudgetDto>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: {
      name: "",
      colorTag: "",
      maximumSpending: 0,
    },
  });

  const colorTag = form.watch("colorTag");

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Budget Name</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder="e.g., Groceries, Rent, Utilities"
                  {...field}
                  aria-invalid={!!form.formState.errors.name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maximumSpending"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="maximumSpending">Maximum Spending</FormLabel>
              <FormControl>
                <Input
                  id="maximumSpending"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? parseFloat(value) : 0);
                  }}
                  aria-invalid={!!form.formState.errors.maximumSpending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="colorTag"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="colorTag">Color</FormLabel>
              <FormControl>
                <ColorPicker
                  id="colorTag"
                  value={colorTag}
                  onChange={(color: string) => field.onChange(color)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? operation === "create"
                ? "Creating..."
                : "Updating..."
              : operation === "create"
                ? "Create Budget"
                : "Update Budget"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
