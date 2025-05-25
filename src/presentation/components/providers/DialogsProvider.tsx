"use client";

import CreateBudgetDialog from "@/presentation/components/dialogs/CreateBudgetDialog";
import CreateIncomeDialog from "@/presentation/components/dialogs/CreateIncomeDialog";
import { memo } from "react";

// Memoize the dialogs to prevent unnecessary re-renders
const MemoizedCreateBudgetDialog = memo(CreateBudgetDialog);
const MemoizedCreateIncomeDialog = memo(CreateIncomeDialog);

export const DialogsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      {children}
      <MemoizedCreateBudgetDialog />
      <MemoizedCreateIncomeDialog />
    </>
  );
};

export default DialogsProvider;
