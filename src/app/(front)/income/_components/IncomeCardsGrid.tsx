"use client";

import { trpc } from "@/presentation/trpc/client";
import Link from "next/link";
import { Pagination } from "../../transactions/_components/TransactionsTable/Pagination";
import { IncomeCard } from "./IncomeCard";

interface IncomeCardsGridProps {
  page: number;
  pageSize: number;
}

export function IncomeCardsGrid({ page, pageSize }: IncomeCardsGridProps) {
  const [incomes] = trpc.getPaginatedIncomesWithTransactions.useSuspenseQuery({
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

  if (!incomes.data.length) {
    return (
      <div className="bg-muted/10 flex flex-col items-center justify-center rounded-lg border p-8">
        <h3 className="mb-2 text-xl font-medium">No incomes found</h3>
        <p className="text-muted-foreground mb-4">
          You have not created any incomes yet.
        </p>
        <Link href="#" className="text-primary hover:underline">
          Create your first income
        </Link>
      </div>
    );
  }

  const totalPages = Math.ceil(incomes.meta.pagination.totalItems / pageSize);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {incomes.data.map((income) => (
          <IncomeCard key={income.id} income={income} />
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
