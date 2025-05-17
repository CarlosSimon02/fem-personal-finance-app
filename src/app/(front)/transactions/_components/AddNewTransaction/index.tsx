"use client";

import { PlusCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";

import { CreateTransactionDto } from "@/core/schemas/transactionSchema";
import { toast } from "sonner";
import createTransactionAction from "../../_actions/createTransactionAction";
import { TransactionForm } from "./TransactionForm";

const AddNewTransaction = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateTransactionDto) => {
    try {
      setIsSubmitting(true);
      await createTransactionAction(data);
      toast.success("Transaction created successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddNewTransaction;
