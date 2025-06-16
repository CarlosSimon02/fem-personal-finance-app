"use client";

import { MoneyOperationInput, PotDto } from "@/core/schemas/potSchema";
import { Button } from "@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import {
  useAddMoneyToPot,
  useWithdrawMoneyFromPot,
} from "@/presentation/hooks/usePots";
import { ReactNode, useState } from "react";

type MoneyOperationDialogProps = {
  children: ReactNode;
  pot: PotDto;
  operation: "add" | "withdraw";
  onError?: (error: Error) => void;
};

const MoneyOperationDialog = ({
  children,
  pot,
  operation,
  onError,
}: MoneyOperationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);

  const handleError = (error: Error) => {
    if (onError) {
      onError(error);
    } else {
      console.error("Money operation error:", error);
    }
  };

  const { mutateAsync: addMoney, isPending: isAdding } = useAddMoneyToPot({
    onError: handleError,
    onSuccess: () => setIsOpen(false),
  });

  const { mutateAsync: withdrawMoney, isPending: isWithdrawing } =
    useWithdrawMoneyFromPot({
      onError: handleError,
      onSuccess: () => setIsOpen(false),
    });

  const isPending = isAdding || isWithdrawing;

  const newAmount =
    operation === "add"
      ? pot.totalSaved + amount
      : Math.max(0, pot.totalSaved - amount);

  const currentPercentage = (pot.totalSaved / pot.target) * 100;
  const newPercentage = (newAmount / pot.target) * 100;
  const operationPercentage = Math.abs(newPercentage - currentPercentage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || amount <= 0) return;

    const data: MoneyOperationInput = { amount };

    if (operation === "add") {
      await addMoney({ id: pot.id, data });
    } else {
      await withdrawMoney({ id: pot.id, data });
    }

    setAmount(0);
  };

  const getTitle = () => {
    return operation === "add"
      ? `Add to ${pot.name}`
      : `Withdraw from ${pot.name}`;
  };

  const getDescription = () => {
    if (operation === "add") {
      return "Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance.";
    }
    return "Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot.";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">New Amount</Label>
              <span className="text-2xl font-bold">
                ₱{newAmount.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              <div className="bg-muted relative h-2 w-full rounded-full">
                {/* Current saved amount */}
                <div
                  className="absolute top-0 left-0 h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, currentPercentage)}%`,
                    backgroundColor: pot.colorTag,
                  }}
                />

                {/* Operation amount overlay */}
                {amount > 0 && (
                  <div
                    className={`absolute top-0 h-2 rounded-full ${
                      operation === "add" ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{
                      left:
                        operation === "add"
                          ? `${Math.min(100, currentPercentage)}%`
                          : `${Math.min(100, newPercentage)}%`,
                      width: `${Math.min(100 - (operation === "add" ? currentPercentage : newPercentage), operationPercentage)}%`,
                    }}
                  />
                )}
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-medium">{newPercentage.toFixed(1)}%</span>
                <span className="text-muted-foreground">
                  Target of ₱{pot.target.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">
              {operation === "add" ? "Amount to Add" : "Amount to Withdraw"}
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              step="0.01"
              min="0"
              max={operation === "withdraw" ? pot.totalSaved : undefined}
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !amount}
              className="flex-1"
            >
              {isPending
                ? operation === "add"
                  ? "Adding..."
                  : "Withdrawing..."
                : operation === "add"
                  ? "Confirm Addition"
                  : "Confirm Withdrawal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MoneyOperationDialog;
