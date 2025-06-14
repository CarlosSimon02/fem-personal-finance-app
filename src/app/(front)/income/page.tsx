import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  getIncomesSummaryAction,
  getPaginatedIncomesWithTransactionsAction,
} from "@/presentation/actions/incomeActions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import CreateIncomeDialog from "./_components/CreateIncomeDialog";
import IncomeContainer from "./_components/IncomeContainer";

type IncomesPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function IncomesPage({ searchParams }: IncomesPageProps) {
  const queryClient = new QueryClient();

  const paramsResult = await searchParams;
  const page = Number.parseInt(paramsResult.page || "1", 10);

  const params: PaginationParams = {
    sort: {
      field: "createdAt",
      order: "desc",
    },
    filters: [],
    search: "",
    pagination: {
      page,
      limitPerPage: 4,
    },
  };

  Promise.all([
    await queryClient.prefetchQuery({
      queryKey: ["incomes", params],
      queryFn: async () => {
        const result = await getPaginatedIncomesWithTransactionsAction(params);
        if (result.error) {
          throw new Error(result.error);
        }
        return result.data;
      },
    }),
    await queryClient.prefetchQuery({
      queryKey: ["summary"],
      queryFn: async () => {
        const result = await getIncomesSummaryAction(undefined);
        if (result.error) {
          throw new Error(result.error);
        }
        return result.data;
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container space-y-6 py-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">Incomes</h1>
          <CreateIncomeDialog />
        </div>

        <IncomeContainer />
      </div>
    </HydrationBoundary>
  );
}
