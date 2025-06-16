import CreateUpdatePotDialog from "@/presentation/components/dialogs/CreateUpdatePotDialog";
import { Button } from "@/presentation/components/ui/button";
import { PlusCircle } from "lucide-react";

const CreatePotDialog = () => {
  return (
    <CreateUpdatePotDialog title="Create Pot" operation="create">
      <Button className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Add New Pot
      </Button>
    </CreateUpdatePotDialog>
  );
};

export default CreatePotDialog;
