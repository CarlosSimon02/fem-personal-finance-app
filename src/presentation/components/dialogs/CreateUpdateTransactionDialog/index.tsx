"use client";

import {
  CreateTransactionDto,
  TransactionDto,
  UpdateTransactionDto,
} from "@/core/schemas/transactionSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "@/presentation/hooks/useTransactions";
import { debugLog } from "@/utils/debugLog";
import { getTransactionChangedFields, hasChanges } from "@/utils/formUtils";
import { useState } from "react";
import { TransactionForm } from "./TransactionForm";

type CreateUpdateTransactionDialogProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  operation: "create" | "update";
  initialData?: TransactionDto;
  onSuccess?: (data: TransactionDto) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const CreateUpdateTransactionDialog = ({
  children,
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
}: CreateUpdateTransactionDialogProps) => {
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

  const { mutateAsync: createTransaction, isPending: isCreatingTransaction } =
    useCreateTransaction({
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

  const { mutateAsync: updateTransaction, isPending: isUpdatingTransaction } =
    useUpdateTransaction({
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

  const handleSubmit = async (data: CreateTransactionDto) => {
    if (operation === "create") {
      await createTransaction(data);
    } else if (operation === "update" && initialData) {
      // Get only the changed fields to optimize network payload
      const changedFields = getTransactionChangedFields(
        initialData,
        data
      ) as UpdateTransactionDto;

      // Only proceed with update if there are actually changes
      if (!hasChanges(changedFields)) {
        // No changes detected, just close the dialog
        debugLog(
          "CreateUpdateTransactionDialog",
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

      await updateTransaction({
        transactionId: initialData.id,
        data: changedFields,
      });
    }
  };

  const isSubmitting = isCreatingTransaction || isUpdatingTransaction;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <TransactionForm
          operation={operation}
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => {
            handleOpenChange(false);
          }}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateUpdateTransactionDialog;
