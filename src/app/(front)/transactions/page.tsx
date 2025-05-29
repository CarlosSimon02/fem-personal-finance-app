import CreateUpdateTransactionDialog from "@/presentation/components/dialogs/CreateUpdateTransactionDialog";
import { Button } from "@/presentation/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Suspense } from "react";
import { SearchFilterBar } from "./_components/SearchFilterBar";
import { TransactionsSkeleton } from "./_components/TransactionsSkeleton";
import { TransactionsTable } from "./_components/TransactionsTable";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sortBy?: string;
    order?: string;
    page?: string;
  }>;
}) {
  const paramsResult = await searchParams;
  const search = paramsResult.search || "";
  const category = paramsResult.category || "";
  const sortBy = paramsResult.sortBy || "transactionDate";
  const order = paramsResult.order || "desc";
  const page = Number.parseInt(paramsResult.page || "1", 10);

  return (
    <div className="container space-y-6 py-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <CreateUpdateTransactionDialog
          title="Create Transaction"
          operation="create"
        >
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New Transaction
          </Button>
        </CreateUpdateTransactionDialog>
      </div>

      <SearchFilterBar
        search={search}
        category={category}
        sortBy={sortBy}
        order={order}
      />

      <Suspense fallback={<TransactionsSkeleton />}>
        <TransactionsTable
          search={search}
          category={category}
          sortBy={sortBy}
          order={order}
          page={page}
        />
      </Suspense>
    </div>
  );
}
