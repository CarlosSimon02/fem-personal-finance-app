"use client";

import {
  IncomeDto,
  UpdateIncomeDto,
  type CreateIncomeDto,
} from "@/core/schemas/incomeSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import {
  useCreateIncome,
  useUpdateIncome,
} from "@/presentation/hooks/useIncomes";
import { debugLog } from "@/utils/debugLog";
import { getChangedFields, hasChanges } from "@/utils/formUtils";
import { useState } from "react";
import { IncomeForm } from "./IncomeForm";

type CreateUpdateIncomeDialogProps = {
  title: string;
  description?: string;
  operation: "create" | "update";
  initialData?: IncomeDto;
  onSuccess?: (data: IncomeDto) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
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
  children,
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

  const { mutateAsync: createIncome, isPending: isCreatingIncome } =
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

  const { mutateAsync: updateIncome, isPending: isUpdatingIncome } =
    useUpdateIncome({
      onSuccess: (data: IncomeDto) => {
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
    if (operation === "create") {
      await createIncome(data);
    } else if (operation === "update" && initialData) {
      // Get only the changed fields to optimize network payload
      const changedFields = getChangedFields(
        initialData,
        data
      ) as UpdateIncomeDto;

      // Only proceed with update if there are actually changes
      if (!hasChanges(changedFields)) {
        // No changes detected, just close the dialog
        debugLog(
          "CreateUpdateIncomeDialog",
          "No changes detected, closing dialog"
        );

        handleOpenChange(false);
        return;
      }

      debugLog(
        "CreateUpdateTransactionDialog",
        "Updating transaction with changes:",
        changedFields
      );

      await updateIncome({
        id: initialData.id,
        data: changedFields,
      });
    }
  };

  const isSubmitting = isCreatingIncome || isUpdatingIncome;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
