"use client";

import { IncomeWithTransactionsDto } from "@/core/schemas/incomeSchema";
import ConfirmDeleteDialog from "@/presentation/components/dialogs/ConfirmDeleteDialog";
import CreateUpdateIncomeDialog from "@/presentation/components/dialogs/CreateUpdateIncomeDialog";
import { Button } from "@/presentation/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { useDeleteIncome } from "@/presentation/hooks/useIncomes";
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";

type IncomeCardActionsProps = {
  income: IncomeWithTransactionsDto;
};

const IncomeCardActions = ({ income }: IncomeCardActionsProps) => {
  const handleError = (error: Error) => {
    console.error("Budget action error:", error);
  };

  const { mutateAsync: deleteIncome, isPending: isDeleting } = useDeleteIncome({
    onError: handleError,
  });

  const handleDelete = async () => {
    await deleteIncome(income.id);
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
          <CreateUpdateIncomeDialog
            title="Edit Income"
            operation="update"
            initialData={income}
            onError={handleError}
          >
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Edit
            </DropdownMenuItem>
          </CreateUpdateIncomeDialog>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ConfirmDeleteDialog
            title="Delete Income"
            description="Are you sure you want to delete this income? This action cannot be undone."
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

export default IncomeCardActions;
