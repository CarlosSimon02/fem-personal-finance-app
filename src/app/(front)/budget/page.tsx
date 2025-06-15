import { PaginationParams } from "@/core/schemas/paginationSchema";
import { HydrateClient, trpc } from "@/presentation/trpc/server";
import BudgetContainer from "./_components/BudgetContainer";
import CreateBudgetDialog from "./_components/CreateBudgetDialog";

type BudgetsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function BudgetsPage({ searchParams }: BudgetsPageProps) {
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

  trpc.getPaginatedBudgetsWithTransactions.prefetch(params);
  trpc.getBudgetsSummary.prefetch();

  return (
    <HydrateClient>
      <div className="container space-y-6 py-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">Budgets</h1>
          <CreateBudgetDialog />
        </div>

        <BudgetContainer />
      </div>
    </HydrateClient>
  );
}
