"use client";

import { BudgetDto, type CreateBudgetDto } from "@/core/schemas/budgetSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { useCreateBudget } from "@/presentation/hooks/useBudgets";
import { useState } from "react";
import { BudgetForm } from "./BudgetForm";

type CreateUpdateBudgetDialogProps = {
  title: string;
  description?: string;
  operation: "create" | "update";
  initialData?: Partial<CreateBudgetDto>;
  onSuccess?: (data: BudgetDto) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const CreateUpdateBudgetDialog = ({
  title,
  description,
  operation,
  initialData,
  onSuccess,
  onError,
  onSettled,
  onClose,
  open: propsOpen,
  onOpenChange: propsOnOpenChange,
}: CreateUpdateBudgetDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = propsOpen !== undefined;
  const open = isControlled ? propsOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    propsOnOpenChange?.(newOpen);

    if (!newOpen) {
      onClose?.();
    }
  };

  const { mutateAsync: createBudget, isPending: isSubmitting } =
    useCreateBudget({
      onSuccess: (data: BudgetDto) => {
        handleOpenChange(false);
        onSuccess?.(data);
      },
      onError: (error: Error) => {
        onError?.(error);
      },
      onSettled: () => {
        onSettled?.();
      },
    });

  const handleSubmit = async (data: CreateBudgetDto) => {
    await createBudget(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <BudgetForm
          onSubmit={handleSubmit}
          onCancel={() => handleOpenChange(false)}
          isSubmitting={isSubmitting}
          operation={operation}
          initialData={initialData as BudgetDto}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateUpdateBudgetDialog;
