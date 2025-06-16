"use client";

import { PotDto } from "@/core/schemas/potSchema";
import ConfirmDeleteDialog from "@/presentation/components/dialogs/ConfirmDeleteDialog";
import CreateUpdatePotDialog from "@/presentation/components/dialogs/CreateUpdatePotDialog";
import { Button } from "@/presentation/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { useDeletePot } from "@/presentation/hooks/usePots";
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";

type PotCardActionsProps = {
  pot: PotDto;
};

const PotCardActions = ({ pot }: PotCardActionsProps) => {
  const handleError = (error: Error) => {
    console.error("Pot action error:", error);
  };

  const { mutateAsync: deletePot, isPending: isDeleting } = useDeletePot({
    onError: handleError,
  });

  const handleDelete = async () => {
    await deletePot(pot.id);
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
          <CreateUpdatePotDialog
            title="Edit Pot"
            operation="update"
            initialData={pot}
            onError={handleError}
          >
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Edit
            </DropdownMenuItem>
          </CreateUpdatePotDialog>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ConfirmDeleteDialog
            title="Delete Pot"
            description="Are you sure you want to delete this pot? This action cannot be undone."
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

export default PotCardActions;
