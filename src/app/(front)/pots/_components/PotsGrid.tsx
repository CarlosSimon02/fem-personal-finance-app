import Link from "next/link";
import { getPaginatedPots } from "../../overview/_data";
import { Pagination } from "../../transactions/_components/TransactionsTable/Pagination";
import { PotCard } from "./PotCard";

interface PotsGridProps {
  page: number;
}

export async function PotsGrid({ page }: PotsGridProps) {
  const { pots, totalPages } = await getPaginatedPots(page, 6);

  if (pots.length === 0) {
    return (
      <div className="bg-muted/10 flex flex-col items-center justify-center rounded-lg border p-8">
        <h3 className="mb-2 text-xl font-medium">No pots found</h3>
        <p className="text-muted-foreground mb-4">
          You have nott created any savings pots yet.
        </p>
        <Link href="#" className="text-primary hover:underline">
          Create your first pot
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pots.map((pot) => (
          <PotCard key={pot.id} pot={pot} />
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
