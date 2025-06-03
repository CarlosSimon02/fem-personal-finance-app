"use client";

import CreateUpdateTransactionDialog from "@/presentation/components/dialogs/CreateUpdateTransactionDialog";
import { Button } from "@/presentation/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useFilterByCategory } from "../_stores/useFilterByCategory";

const CreateTransactionDialog = () => {
  const { setCacheUniq: setCacheUniqFilterByCategory } = useFilterByCategory();

  return (
    <CreateUpdateTransactionDialog
      title="Create Transaction"
      operation="create"
      onSuccess={() => {
        setCacheUniqFilterByCategory();
      }}
    >
      <Button className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Add New Transaction
      </Button>
    </CreateUpdateTransactionDialog>
  );
};

export default CreateTransactionDialog;
