import CreateUpdateIncomeDialog from "@/presentation/components/dialogs/CreateUpdateIncomeDialog";
import { Button } from "@/presentation/components/ui/button";
import { PlusCircle } from "lucide-react";

const CreateIncomeDialog = () => {
  return (
    <CreateUpdateIncomeDialog title="Create Income" operation="create">
      <Button className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Add New Income
      </Button>
    </CreateUpdateIncomeDialog>
  );
};

export default CreateIncomeDialog;
