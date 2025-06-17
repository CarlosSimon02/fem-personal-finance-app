"use client";

import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";

const CreateRecurringCashFlowDialog = () => {
  return (
    <Button onClick={() => console.log("Create recurring cash flow")}>
      <Plus className="mr-2 h-4 w-4" />
      Add Cash Flow
    </Button>
  );
};

export default CreateRecurringCashFlowDialog;
