import { PaginationParams } from "@/core/schemas/paginationSchema";
import { HydrateClient, trpc } from "@/presentation/trpc/server";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import { TransactionsContainer } from "./_components/TransactionsContainer";

type TransactionsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sortBy?: string;
    order?: string;
    page?: string;
  }>;
};

const TransactionsPage = async ({ searchParams }: TransactionsPageProps) => {
  const paramsResult = await searchParams;
  const search = paramsResult.search || "";
  const category = paramsResult.category || "";
  const sortBy = paramsResult.sortBy || "transactionDate";
  const order = paramsResult.order || "desc";
  const page = Number.parseInt(paramsResult.page || "1", 10);

  const params: PaginationParams = {
    search,
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
    sort: {
      field: sortBy,
      order: order as "asc" | "desc",
    },
    pagination: {
      page,
      limitPerPage: 10,
    },
  };

  trpc.getPaginatedTransactions.prefetch(params);

  return (
    <HydrateClient>
      <div className="container space-y-6 py-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <CreateTransactionDialog />
        </div>

        <TransactionsContainer />
      </div>
    </HydrateClient>
  );
};

export default TransactionsPage;
