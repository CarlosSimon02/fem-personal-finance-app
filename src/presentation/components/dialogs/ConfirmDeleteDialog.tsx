import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import { Button } from "../ui/button";

type ConfirmDeleteDialogProps = {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleDelete: () => void;
  isDeleting: boolean;
  children: React.ReactNode;
};

const ConfirmDeleteDialog = ({
  title,
  description,
  open: propsOpen,
  onOpenChange: propsOnOpenChange,
  handleDelete,
  isDeleting,
  children,
}: ConfirmDeleteDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = propsOpen !== undefined;
  const open = isControlled ? propsOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    propsOnOpenChange?.(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
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
  );
};

export default ConfirmDeleteDialog;
