import { useSearchParams } from "next/navigation";

export const usePotPageParams = () => {
  const searchParams = useSearchParams();
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 6;

  return {
    page,
    pageSize,
  };
};
