import { useSearchParams } from "next/navigation";

export const useBudgetPageParams = () => {
  const searchParams = useSearchParams();

  return {
    sortBy: searchParams.get("sortBy") || "createdAt",
    order: searchParams.get("order") || "desc",
    page: Number.parseInt(searchParams.get("page") || "1", 10),
    pageSize: Number.parseInt(searchParams.get("pageSize") || "4", 10),
  };
};
