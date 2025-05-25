"use client";

import createIncomeAction from "@/app/(front)/_actions/createIncomeAction";
import {
  createIncomeSchema,
  type CreateIncomeDto,
} from "@/core/schemas/incomeSchema";
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
import { useIncomeDialogStore } from "@/presentation/stores/useIncomeDialogStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateIncomeDialog = () => {
  // Use individual selectors to avoid recreating objects on every render
  const { isOpen, setIsOpen, callbackFn, closeCallbackFn, initialData } =
    useIncomeDialogStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateIncomeDto>({
    resolver: zodResolver(createIncomeSchema),
    defaultValues: {
      name: "",
      colorTag: "", // Default green color
    },
  });

  const colorTag = watch("colorTag");

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: CreateIncomeDto) => {
    try {
      setIsSubmitting(true);

      const response = await createIncomeAction(data);

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error("No data returned from server action");
      }

      if (callbackFn) {
        callbackFn(response.data);
      }

      toast.success("Income created successfully");
      reset();
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to create income");
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
          <DialogTitle>Create New Income</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new income to track your earnings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Income Name</Label>
            <Input
              id="name"
              placeholder="e.g., Salary, Freelance, Investments"
              {...register("name")}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="colorTag">Color</Label>
            <ColorPicker
              id="colorTag"
              value={colorTag}
              onChange={(color: string) => setValue("colorTag", color)}
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
              {isSubmitting ? "Creating..." : "Create Income"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIncomeDialog;
