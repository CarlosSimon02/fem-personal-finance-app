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
  CreateIncomeDto,
  createIncomeSchema,
  IncomeDto,
} from "@/core/schemas/incomeSchema";
import ColorPicker from "../../ui/color-picker";
import { DialogFooter } from "../../ui/dialog";

interface IncomeFormProps {
  onSubmit: (data: CreateIncomeDto) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  operation: "create" | "update";
  initialData?: IncomeDto;
}

export const IncomeForm = ({
  onSubmit,
  onCancel,
  isSubmitting,
  operation,
  initialData,
}: IncomeFormProps) => {
  const form = useForm<CreateIncomeDto>({
    resolver: zodResolver(createIncomeSchema),
    defaultValues: {
      name: "",
      colorTag: "",
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
              <FormLabel htmlFor="name">Income Name</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder="e.g., Salary, Freelance, Investments"
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
                ? "Create Income"
                : "Update Income"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
