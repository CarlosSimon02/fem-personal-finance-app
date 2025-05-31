"use client";

import { TransactionDto } from "@/core/schemas/transactionSchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import { Separator } from "@/presentation/components/ui/separator";
import { format } from "date-fns";
import { Calendar, DollarSign, FileText, Tag, User } from "lucide-react";
import { useState } from "react";
import TransactionAmountDisplay from "./TransactionAmountDisplay";
import TransactionCategoryBadge from "./TransactionCategoryBadge";
import TransactionDetailItem from "./TransactionDetailItem";
import TransactionDialogHeader from "./TransactionDialogHeader";

type TransactionDetailsDialogProps = {
  children: React.ReactNode;
  transaction: TransactionDto;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const TransactionDetailsDialog = ({
  children,
  transaction,
  open: propsOpen,
  onOpenChange: propsOnOpenChange,
}: TransactionDetailsDialogProps) => {
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            <TransactionDialogHeader
              emoji={transaction.emoji}
              name={transaction.name}
            />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            {/* Amount */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="text-muted-foreground h-5 w-5" />
                <span className="text-sm font-medium">Amount</span>
              </div>
              <TransactionAmountDisplay
                amount={transaction.amount}
                type={transaction.type}
              />
            </div>
            <Separator />

            {/* Category */}
            <TransactionDetailItem
              icon={<Tag className="text-muted-foreground h-4 w-4" />}
              label="Category"
              value={
                <TransactionCategoryBadge
                  name={transaction.category.name}
                  colorTag={transaction.category.colorTag}
                />
              }
            />

            {/* Recipient/Payer */}
            {transaction.recipientOrPayer && (
              <TransactionDetailItem
                icon={<User className="text-muted-foreground h-4 w-4" />}
                label={transaction.type === "income" ? "From" : "To"}
                value={transaction.recipientOrPayer}
              />
            )}

            {/* Date */}
            <TransactionDetailItem
              icon={<Calendar className="text-muted-foreground h-4 w-4" />}
              label="Date"
              value={format(transaction.transactionDate, "PPP")}
            />

            {/* Description */}
            {transaction.description && (
              <TransactionDetailItem
                icon={<FileText className="text-muted-foreground h-4 w-4" />}
                label="Description"
                value={transaction.description}
                showSeparator={false}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsDialog;
