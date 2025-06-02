"use client";

import { TransactionDto } from "@/core/schemas/transactionSchema";
import ConfirmDeleteDialog from "@/presentation/components/dialogs/ConfirmDeleteDialog";
import CreateUpdateTransactionDialog from "@/presentation/components/dialogs/CreateUpdateTransactionDialog";
import TransactionDetailsDialog from "@/presentation/components/dialogs/TransactionDetailsDialog";
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
import { useFilterByCategory } from "../../_stores/useFilterByCategory";

type TransactionActionsProps = {
  transaction: TransactionDto;
};

const TransactionActions = ({ transaction }: TransactionActionsProps) => {
  const router = useRouter();
  const { setCacheUniq: setCacheUniqFilterByCategory } = useFilterByCategory();

  const handleSuccess = () => {
    router.refresh();
    setCacheUniqFilterByCategory();
  };

  const handleError = (error: Error) => {
    console.error("Transaction action error:", error);
  };

  const { mutateAsync: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction({
      onSuccess: () => {
        handleSuccess();
      },
      onError: handleError,
    });

  const handleDelete = async () => {
    await deleteTransaction(transaction.id);
  };

  return (
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
          <CreateUpdateTransactionDialog
            title="Edit Transaction"
            operation="update"
            initialData={transaction}
            onSuccess={handleSuccess}
            onError={handleError}
          >
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Edit
            </DropdownMenuItem>
          </CreateUpdateTransactionDialog>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ConfirmDeleteDialog
            title="Delete Transaction"
            description="Are you sure you want to delete this transaction? This action cannot be undone."
            onDelete={handleDelete}
            isDeleting={isDeleting}
          >
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => e.preventDefault()}
            >
              Delete
            </DropdownMenuItem>
          </ConfirmDeleteDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TransactionActions;
