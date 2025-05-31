import { Separator } from "@/presentation/components/ui/separator";
import { ReactNode } from "react";

type TransactionDetailItemProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  showSeparator?: boolean;
};

const TransactionDetailItem = ({
  icon,
  label,
  value,
  showSeparator = true,
}: TransactionDetailItemProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="text-muted-foreground text-sm">{value}</div>
      </div>
      {showSeparator && <Separator />}
    </>
  );
};

export default TransactionDetailItem;
