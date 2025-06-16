import { PaginationParams } from "@/core/schemas/paginationSchema";
import { HydrateClient, trpc } from "@/presentation/trpc/server";
import CreatePotDialog from "./_components/CreatePotDialog";
import PotContainer from "./_components/PotContainer";

export default async function PotsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
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
      limitPerPage: 6,
    },
  };

  trpc.getPaginatedPots.prefetch(params);

  return (
    <HydrateClient>
      <div className="container space-y-6 py-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">Pots</h1>
          <CreatePotDialog />
        </div>

        <PotContainer />
      </div>
    </HydrateClient>
  );
}
