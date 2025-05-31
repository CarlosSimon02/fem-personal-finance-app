import { TransactionDto } from "@/core/schemas/transactionSchema";
import TransactionEmoji from "@/presentation/components/TransactionEmoji";
import AmountDisplay from "./AmountDisplay";
import TransactionActions from "./TransactionActions";

interface TransactionRowProps {
  transaction: TransactionDto;
}

const TransactionRow = ({ transaction }: TransactionRowProps) => {
  return (
    <tr key={transaction.id} className="border-b">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <TransactionEmoji emoji={transaction.emoji} />
          <span className="font-medium">{transaction.recipientOrPayer}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="bg-muted inline-flex items-center rounded-full px-2 py-1 text-xs">
          {transaction.category.name}
        </span>
      </td>
      <td className="text-muted-foreground px-4 py-3">
        {transaction.transactionDate.toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-right">
        <AmountDisplay type={transaction.type} amount={transaction.amount} />
      </td>
      <td className="px-4 py-3">
        <TransactionActions transaction={transaction} />
      </td>
    </tr>
  );
};

export default TransactionRow;
