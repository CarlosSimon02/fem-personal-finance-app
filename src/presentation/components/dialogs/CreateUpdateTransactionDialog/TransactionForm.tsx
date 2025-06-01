"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Textarea } from "@/presentation/components/ui/textarea";

import {
  CreateTransactionDto,
  createTransactionSchema,
  TransactionDto,
} from "@/core/schemas/transactionSchema";
import CategorySelectField from "./CategorySelectField";
import { CategoryOptionType } from "./CategorySelectField/types";
import { CurrencyInputField } from "./CurrencySelectField";
import { EmojiPickerField } from "./EmojiPickerField";
import { TransactionDatePicker } from "./TransactionDatePicker";

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionDto) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  operation: "create" | "update";
  initialData?: TransactionDto;
}

export const TransactionForm = ({
  onSubmit,
  onCancel,
  isSubmitting,
  initialData,
  operation,
}: TransactionFormProps) => {
  const [category, setCategory] = useState<CategoryOptionType | null>(
    initialData?.category
      ? {
          value: initialData?.category.id,
          label: initialData?.category.name,
          colorTag: initialData?.category.colorTag,
        }
      : null
  );

  const form = useForm<CreateTransactionDto>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "expense",
      amount: initialData?.amount || 0,
      recipientOrPayer: initialData?.recipientOrPayer || "",
      categoryId: category?.value || "",
      transactionDate: initialData?.transactionDate || new Date(),
      description: initialData?.description || "",
      emoji: initialData?.emoji || "📃",
    },
  });

  const transactionType = form.watch("type");

  useEffect(() => {
    // Only clear if transactionType changes after initial render
    if (form.formState.isDirty) {
      setCategory(null);
      form.setValue("categoryId", "");
    }
  }, [transactionType, form]);

  useEffect(() => {
    form.setValue("categoryId", category?.value || "");
  }, [category, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
        {/* Transaction Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name and Emoji Row */}
        <div className="flex gap-4">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter transaction name"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-24">
            <FormField
              control={form.control}
              name="emoji"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emoji</FormLabel>
                  <FormControl>
                    <EmojiPickerField
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <CurrencyInputField
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                  placeholder="0.00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CategorySelectField
                  value={category}
                  onChange={(value) => {
                    setCategory(value);
                  }}
                  transactionType={transactionType}
                  disabled={isSubmitting}
                  selectRef={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Transaction Date */}
        <FormField
          control={form.control}
          name="transactionDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <FormControl>
                <TransactionDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Recipient/Payer */}
        <FormField
          control={form.control}
          name="recipientOrPayer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {transactionType === "income" ? "Payer" : "Recipient"}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    transactionType === "income"
                      ? "Who paid you?"
                      : "Who did you pay?"
                  }
                  disabled={isSubmitting}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add details about this transaction"
                  className="resize-none"
                  disabled={isSubmitting}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {operation === "create" ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
