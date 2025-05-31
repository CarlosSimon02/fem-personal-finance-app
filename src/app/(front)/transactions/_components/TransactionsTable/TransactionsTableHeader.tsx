const TransactionsTableHeader = () => {
  return (
    <thead>
      <tr className="bg-muted/50 border-b">
        <th className="px-4 py-3 text-left font-medium">Recipient/Sender</th>
        <th className="px-4 py-3 text-left font-medium">Category</th>
        <th className="px-4 py-3 text-left font-medium">Transaction Date</th>
        <th className="px-4 py-3 text-right font-medium">Amount</th>
        <th className="w-[50px] px-4 py-3"></th>
      </tr>
    </thead>
  );
};

export default TransactionsTableHeader;
