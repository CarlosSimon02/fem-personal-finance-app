import CreateUpdateBudgetDialog from "@/presentation/components/dialogs/CreateUpdateBudgetDialog";
import { Button } from "@/presentation/components/ui/button";
import { PlusCircle } from "lucide-react";

const CreateBudgetDialog = () => {
  return (
    <CreateUpdateBudgetDialog title="Create Budget" operation="create">
      <Button className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Add New Budget
      </Button>
    </CreateUpdateBudgetDialog>
  );
};

export default CreateBudgetDialog;
