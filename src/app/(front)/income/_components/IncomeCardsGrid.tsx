import Link from "next/link";
import { getPaginatedBudgets } from "../../overview/_data";
import { Pagination } from "../../transactions/_components/TransactionsTable/Pagination";
import { IncomeCard } from "./IncomeCard";

interface IncomeCardsGridProps {
  page: number;
}

export async function IncomeCardsGrid({ page }: IncomeCardsGridProps) {
  const { budgets, totalPages } = await getPaginatedBudgets(page, 4);

  if (budgets.length === 0) {
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {budgets.map((budget) => (
          <IncomeCard key={budget.id} budget={budget} />
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
