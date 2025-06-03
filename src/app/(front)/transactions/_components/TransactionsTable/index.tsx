"use client";

import { useTransactionsRealtime } from "@/presentation/hooks/useTransactions";
import { AlertCircle } from "lucide-react";
import { TransactionsSkeleton } from "../TransactionsSkeleton";
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
  const { data, isPending, error, isError } = useTransactionsRealtime({
    search,
    category,
    sortBy,
    order,
    page,
    pageSize: 10,
  });

  if (isPending) {
    return <TransactionsSkeleton />;
  }

  if (isError) {
    return (
      <div className="border-destructive bg-destructive/10 text-destructive flex items-center gap-2 rounded-md border p-4">
        <AlertCircle className="h-4 w-4" />
        <p>
          {error instanceof Error
            ? error.message
            : "Failed to load transactions. Please try again."}
        </p>
      </div>
    );
  }

  if (!data || !data.data.length) {
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
