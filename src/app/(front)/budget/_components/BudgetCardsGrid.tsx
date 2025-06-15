"use client";

import { trpc } from "@/presentation/trpc/client";
import Link from "next/link";
import { Pagination } from "../../transactions/_components/TransactionsTable/Pagination";
import { BudgetCard } from "./BudgetCard";

interface BudgetCardsGridProps {
  page: number;
  pageSize: number;
}

export function BudgetCardsGrid({ page, pageSize }: BudgetCardsGridProps) {
  const [budgets] = trpc.getPaginatedBudgetsWithTransactions.useSuspenseQuery({
    pagination: {
      page,
      limitPerPage: pageSize,
    },
    sort: {
      field: "createdAt",
      order: "desc",
    },
    filters: [],
    search: "",
  });

  if (!budgets.data.length) {
    return (
      <div className="bg-muted/10 flex flex-col items-center justify-center rounded-lg border p-8">
        <h3 className="mb-2 text-xl font-medium">No budgets found</h3>
        <p className="text-muted-foreground mb-4">
          You have not created any budgets yet.
        </p>
        <Link href="#" className="text-primary hover:underline">
          Create your first budget
        </Link>
      </div>
    );
  }

  const totalPages = Math.ceil(budgets.meta.pagination.totalItems / pageSize);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {budgets.data.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          search=""
          category=""
          sortBy=""
          order=""
        />
      )}
    </div>
  );
}
