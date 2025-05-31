import { cn } from "@/utils/lib/shadcnUtils";

type TransactionAmountDisplayProps = {
  amount: number;
  type: "income" | "expense";
};

const TransactionAmountDisplay = ({
  amount,
  type,
}: TransactionAmountDisplayProps) => {
  const formatCurrency = (amount: number) => {
    return `₱${Math.abs(amount).toLocaleString()}`;
  };

  const getAmountColor = () => {
    return type === "income" ? "text-green-600" : "text-red-600";
  };

  const getAmountPrefix = () => {
    return type === "income" ? "+" : "-";
  };

  return (
    <div className={cn("text-2xl font-bold", getAmountColor())}>
      {getAmountPrefix()}
      {formatCurrency(amount)}
    </div>
  );
};

export default TransactionAmountDisplay;
