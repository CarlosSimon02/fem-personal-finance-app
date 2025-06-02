import { TransactionDto } from "@/core/schemas/transactionSchema";
import TransactionEmoji from "@/presentation/components/TransactionEmoji";
import AmountDisplay from "./AmountDisplay";
import TransactionActions from "./TransactionActions";

type MobileTransactionCardProps = {
  transaction: TransactionDto;
};

const MobileTransactionCard = ({ transaction }: MobileTransactionCardProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <TransactionEmoji emoji={transaction.emoji} />
        <div>
          <p className="font-medium">{transaction.name}</p>
          <span className="bg-muted mt-1 inline-flex items-center rounded-full px-2 py-1 text-xs">
            {transaction.category.name}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <AmountDisplay
          type={transaction.type}
          amount={transaction.amount}
          className="font-medium"
        />
        <span className="text-muted-foreground mt-1 text-xs">
          {transaction.transactionDate.toLocaleDateString()}
        </span>
      </div>
      <TransactionActions transaction={transaction} />
    </div>
  );
};

export default MobileTransactionCard;
