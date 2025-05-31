import { getPaginatedTransactionsAction } from "@/presentation/actions/transactionActions";
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

const TransactionsTable = async ({
  search,
  category,
  sortBy,
  order,
  page,
}: TransactionsTableProps) => {
  // Fetch and process data on the server
  const { data, error } = await getPaginatedTransactionsAction({
    filters:
      category && category !== "all"
        ? [
            {
              field: "category.name",
              operator: "==",
              value: category,
            },
          ]
        : [],
    pagination: {
      page,
      limitPerPage: 10,
    },
    sort: {
      order: order === "asc" ? "asc" : "desc",
      field: sortBy,
    },
    search,
  });

  if (error) {
    return <div>Error: {error}</div>;
  }

  const transactions = data?.data || [];
  const totalPages =
    Math.ceil(
      (data?.meta.pagination.totalItems || 0) /
        (data?.meta.pagination.limitPerPage || 10)
    ) || 1;

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
