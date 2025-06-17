import { PaginationParams } from "@/core/schemas/paginationSchema";
import CreateRecurringCashFlowDialog from "./_components/CreateRecurringCashFlowDialog";
import RecurringCashFlowContainer from "./_components/RecurringCashFlowContainer";

type RecurringCashFlowPageProps = {
  searchParams: Promise<{
    search?: string;
    type?: string;
    status?: string;
    sortBy?: string;
    order?: string;
    page?: string;
  }>;
};

export default async function RecurringCashFlowPage({
  searchParams,
}: RecurringCashFlowPageProps) {
  const paramsResult = await searchParams;
  const search = paramsResult.search || "";
  const type = paramsResult.type || "";
  const status = paramsResult.status || "";
  const sortBy = paramsResult.sortBy || "createdAt";
  const order = paramsResult.order || "desc";
  const page = Number.parseInt(paramsResult.page || "1", 10);

  const params: PaginationParams = {
    search,
    filters: [
      ...(type && type !== "all"
        ? [{ field: "type", operator: "==" as const, value: type }]
        : []),
      ...(status && status !== "all"
        ? [{ field: "status", operator: "==" as const, value: status }]
        : []),
    ],
    sort: {
      field: sortBy,
      order: order as "asc" | "desc",
    },
    pagination: {
      page,
      limitPerPage: 10,
    },
  };

  return (
    <div className="container space-y-6 py-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Recurring Cash Flow</h1>
        <CreateRecurringCashFlowDialog />
      </div>

      <RecurringCashFlowContainer />
    </div>
  );
}
