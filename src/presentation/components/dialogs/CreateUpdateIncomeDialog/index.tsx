"use client";

import { IncomeDto, type CreateIncomeDto } from "@/core/schemas/incomeSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { useCreateIncome } from "@/presentation/hooks/useIncomes";
import { useState } from "react";
import { IncomeForm } from "./IncomeForm";

type CreateUpdateIncomeDialogProps = {
  title: string;
  description?: string;
  operation: "create" | "update";
  initialData?: Partial<CreateIncomeDto>;
  onSuccess?: (data: IncomeDto) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const CreateUpdateIncomeDialog = ({
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
}: CreateUpdateIncomeDialogProps) => {
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

  const { mutateAsync: createIncome, isPending: isSubmitting } =
    useCreateIncome({
      onSuccess: (data) => {
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

  const handleSubmit = async (data: CreateIncomeDto) => {
    await createIncome(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <IncomeForm
          onSubmit={handleSubmit}
          onCancel={() => handleOpenChange(false)}
          isSubmitting={isSubmitting}
          operation={operation}
          initialData={initialData as IncomeDto}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateUpdateIncomeDialog;
