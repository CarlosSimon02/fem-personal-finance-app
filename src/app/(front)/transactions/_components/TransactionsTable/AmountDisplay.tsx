type AmountDisplayProps = {
  type: "income" | "expense";
  amount: number;
  className?: string;
};

const AmountDisplay = ({
  type,
  amount,
  className = "",
}: AmountDisplayProps) => {
  return (
    <span
      className={`${type === "income" ? "text-green-600" : "text-red-600"} ${className}`}
    >
      {type === "income" ? "+" : "-"}₱{Math.abs(amount).toLocaleString()}
    </span>
  );
};

export default AmountDisplay;
