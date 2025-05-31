"use client";

import { TransactionDto } from "@/core/schemas/transactionSchema";
import CreateUpdateTransactionDialog from "@/presentation/components/dialogs/CreateUpdateTransactionDialog";
import TransactionDetailsDialog from "@/presentation/components/dialogs/TransactionDetailsDialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/presentation/components/ui/alert-dialog";
import { Button } from "@/presentation/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { useDeleteTransaction } from "@/presentation/hooks/useTransactions";
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TransactionActionsProps = {
  transaction: TransactionDto;
};

const TransactionActions = ({ transaction }: TransactionActionsProps) => {
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleSuccess = () => {
    router.refresh();
  };

  const handleError = (error: Error) => {
    console.error("Transaction action error:", error);
  };

  const { mutateAsync: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction({
      onSuccess: () => {
        setShowDeleteAlert(false);
        handleSuccess();
      },
      onError: handleError,
    });

  const handleDelete = async () => {
    await deleteTransaction(transaction.id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <TransactionDetailsDialog transaction={transaction}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                View Details
              </DropdownMenuItem>
            </TransactionDetailsDialog>
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              Edit
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setShowDeleteAlert(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <CreateUpdateTransactionDialog
        title="Edit Transaction"
        operation="update"
        initialData={transaction}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={handleSuccess}
        onError={handleError}
      >
        <div />
      </CreateUpdateTransactionDialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteAlert(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionActions;
