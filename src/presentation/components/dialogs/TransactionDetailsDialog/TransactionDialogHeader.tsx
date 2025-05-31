type TransactionDialogHeaderProps = {
  emoji: string;
  name: string;
};

const TransactionDialogHeader = ({
  emoji,
  name,
}: TransactionDialogHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 text-left">
        <span className="text-2xl">{emoji}</span>
        <div>
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-muted-foreground text-sm">
            Transaction Details
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDialogHeader;
