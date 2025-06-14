"use client";

import { BudgetWithTransactionsDto } from "@/core/schemas/budgetSchema";
import ConfirmDeleteDialog from "@/presentation/components/dialogs/ConfirmDeleteDialog";
import CreateUpdateBudgetDialog from "@/presentation/components/dialogs/CreateUpdateBudgetDialog";
import { Button } from "@/presentation/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { useDeleteBudget } from "@/presentation/hooks/useBudgets";
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";

type BudgetCardActionsProps = {
  budget: BudgetWithTransactionsDto;
};

const BudgetCardActions = ({ budget }: BudgetCardActionsProps) => {
  const handleError = (error: Error) => {
    console.error("Budget action error:", error);
  };

  const { mutateAsync: deleteBudget, isPending: isDeleting } = useDeleteBudget({
    onError: handleError,
  });

  const handleDelete = async () => {
    await deleteBudget(budget.id);
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
          <CreateUpdateBudgetDialog
            title="Edit Budget"
            operation="update"
            initialData={budget}
            onError={handleError}
          >
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Edit
            </DropdownMenuItem>
          </CreateUpdateBudgetDialog>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ConfirmDeleteDialog
            title="Delete Budget"
            description="Are you sure you want to delete this budget? This action cannot be undone."
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

export default BudgetCardActions;
