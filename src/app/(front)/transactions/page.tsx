import { getPaginatedTransactionsAction } from "@/presentation/actions/transactionActions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import AddNewTransaction from "./_components/AddNewTransaction";
import { TransactionsContainer } from "./_components/TransactionsContainer";
import { TransactionsSkeleton } from "./_components/TransactionsSkeleton";

const TransactionsPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["transactions"],
    queryFn: () =>
      getPaginatedTransactionsAction({
        search: "",
        filters: [],
        sort: {
          field: "transactionDate",
          order: "desc",
        },
        pagination: {
          page: 1,
          limitPerPage: 10,
        },
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container space-y-6 py-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <AddNewTransaction />
        </div>

        <Suspense fallback={<TransactionsSkeleton />}>
          <TransactionsContainer />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
};

export default TransactionsPage;
