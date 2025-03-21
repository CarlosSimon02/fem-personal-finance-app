import { Button } from "@/presentation/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Suspense } from "react";
import { PotsGrid } from "./_components/PotsGrid";
import { PotsSkeleton } from "./_components/PotsSkeleton";

export default async function PotsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const paramsResult = await searchParams;
  const page = Number.parseInt(paramsResult.page || "1", 10);

  return (
    <div className="container space-y-6 py-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Pots</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Pot
        </Button>
      </div>

      <Suspense fallback={<PotsSkeleton />}>
        <PotsGrid page={page} />
      </Suspense>
    </div>
  );
}
