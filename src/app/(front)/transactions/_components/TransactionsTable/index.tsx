"use client";

import { trpc } from "@/presentation/trpc/client";
import MobileTransactionCard from "./MobileTransactionCard";
import { Pagination } from "./Pagination";
import TransactionRow from "./TransactionRow";
import TransactionsTableHeader from "./TransactionsTableHeader";

type TransactionsTableProps = {
  search: string;
  category: string;
  sortBy: string;
  order: string;
  page: number;
};

const TransactionsTable = ({
  search,
  category,
  sortBy,
  order,
  page,
}: TransactionsTableProps) => {
  const [data] = trpc.getPaginatedTransactions.useSuspenseQuery({
    search,
    filters: category
      ? [{ field: "category.name", operator: "==", value: category }]
      : [],
    sort: {
      field: sortBy,
      order: order as "asc" | "desc",
    },
    pagination: {
      page,
      limitPerPage: 10,
    },
  });

  if (!data.data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground text-lg">No transactions found</p>
        <p className="text-muted-foreground text-sm">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  const transactions = data.data;
  const totalPages = Math.ceil(
    data.meta.pagination.totalItems / data.meta.pagination.limitPerPage
  );

  return (
    <div className="space-y-4">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="rounded-md border">
          <table className="w-full">
            <TransactionsTableHeader />
            <tbody>
              {transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="space-y-4 md:hidden">
        {transactions.map((transaction) => (
          <MobileTransactionCard
            key={transaction.id}
            transaction={transaction}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          search={search}
          category={category}
          sortBy={sortBy}
          order={order}
        />
      )}
    </div>
  );
};

export default TransactionsTable;
