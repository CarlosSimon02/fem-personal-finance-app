import { Badge } from "@/presentation/components/ui/badge";

type TransactionCategoryBadgeProps = {
  name: string;
  colorTag: string;
};

const TransactionCategoryBadge = ({
  name,
  colorTag,
}: TransactionCategoryBadgeProps) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className="sr-only size-3 rounded-full"
        style={{ backgroundColor: colorTag }}
      />
      <Badge className="text-xs" variant="secondary">
        {name}
      </Badge>
    </div>
  );
};

export default TransactionCategoryBadge;
