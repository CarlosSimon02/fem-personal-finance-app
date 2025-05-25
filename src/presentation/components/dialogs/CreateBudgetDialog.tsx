"use client";

import createBudgetAction from "@/app/(front)/_actions/createBudgetAction";
import {
  createBudgetSchema,
  type CreateBudgetDto,
} from "@/core/schemas/budgetSchema";
import { Button } from "@/presentation/components/ui/button";
import { ColorPicker } from "@/presentation/components/ui/color-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { useBudgetDialogStore } from "@/presentation/stores/useBudgetDialogStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateBudgetDialog = () => {
  const { isOpen, setIsOpen, callbackFn, closeCallbackFn, initialData } =
    useBudgetDialogStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateBudgetDto>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: {
      name: "",
      maximumSpending: 0,
      colorTag: "",
    },
  });

  const colorTag = watch("colorTag");

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: CreateBudgetDto) => {
    try {
      setIsSubmitting(true);

      const response = await createBudgetAction(data);

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error("No data returned from server action");
      }

      if (callbackFn) {
        callbackFn(response.data);
      }

      toast.success("Budget created successfully");
      reset();
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to create budget");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    reset();
    setIsOpen(false);
    closeCallbackFn();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new budget to track your spending.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Budget Name</Label>
            <Input
              id="name"
              placeholder="e.g., Groceries, Rent, Utilities"
              {...register("name")}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maximumSpending">Maximum Spending</Label>
            <Input
              id="maximumSpending"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("maximumSpending", {
                valueAsNumber: true,
              })}
              aria-invalid={!!errors.maximumSpending}
            />
            {errors.maximumSpending && (
              <p className="text-sm text-red-500">
                {errors.maximumSpending.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="colorTag">Color</Label>
            <ColorPicker
              id="colorTag"
              value={colorTag}
              onChange={(color) => setValue("colorTag", color)}
            />
            {errors.colorTag && (
              <p className="text-sm text-red-500">{errors.colorTag.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleDialogClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBudgetDialog;
