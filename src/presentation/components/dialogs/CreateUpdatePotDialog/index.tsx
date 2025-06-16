"use client";

import { CreatePotDto, PotDto, UpdatePotDto } from "@/core/schemas/potSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import { useCreatePot, useUpdatePot } from "@/presentation/hooks/usePots";
import { ReactNode, useState } from "react";
import { PotForm } from "./PotForm";

type CreateUpdatePotDialogProps = {
  children: ReactNode;
  title: string;
  operation: "create" | "update";
  initialData?: PotDto;
  onError?: (error: Error) => void;
};

const CreateUpdatePotDialog = ({
  children,
  title,
  operation,
  initialData,
  onError,
}: CreateUpdatePotDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleError = (error: Error) => {
    if (onError) {
      onError(error);
    } else {
      console.error("Pot operation error:", error);
    }
  };

  const { mutateAsync: createPot, isPending: isCreating } = useCreatePot({
    onError: handleError,
    onSuccess: () => setIsOpen(false),
  });

  const { mutateAsync: updatePot, isPending: isUpdating } = useUpdatePot({
    onError: handleError,
    onSuccess: () => setIsOpen(false),
  });

  const isPending = isCreating || isUpdating;

  const handleSubmit = async (data: CreatePotDto | UpdatePotDto) => {
    if (operation === "create") {
      await createPot(data as CreatePotDto);
    } else if (operation === "update" && initialData) {
      await updatePot({ id: initialData.id, data: data as UpdatePotDto });
    }
  };

  const getDescription = () => {
    if (operation === "create") {
      return "Pots are a great way to separate money for specific goals or spending categories. You can set targets and track your progress.";
    }
    return "Update your pot details to better organize your savings goals.";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        <PotForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
          isPending={isPending}
          operation={operation}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateUpdatePotDialog;
