import { subscribeToPotsUseCase } from "@/factories/realtime";
import { revalidatePotTags } from "@/presentation/actions/potActions";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { trpc } from "@/presentation/trpc/client";
import { useEffect } from "react";

interface UsePotPageRealtimeParams {
  sortBy?: string;
  order?: string;
  page?: number;
  pageSize?: number;
}

export const usePotPageRealtime = ({
  sortBy = "createdAt",
  order = "desc",
  page = 1,
  pageSize = 6,
}: UsePotPageRealtimeParams) => {
  const { user } = useAuth();

  const potQuery = trpc.getPaginatedPots.useQuery({
    pagination: {
      page,
      limitPerPage: pageSize,
    },
    sort: {
      field: sortBy,
      order: order as "asc" | "desc",
    },
    filters: [],
    search: "",
  });

  useEffect(() => {
    if (!user) return;

    const unsubscribers: (() => void)[] = [];

    const onRealtimeExecute = async () => {
      await revalidatePotTags();
      potQuery.refetch();
    };

    unsubscribers.push(
      subscribeToPotsUseCase.execute(user.id, onRealtimeExecute, (error) => {
        console.error("Real-time pots error:", error);
      })
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  return {
    potQuery,
  };
};
