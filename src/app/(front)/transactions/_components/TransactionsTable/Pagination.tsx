"use client";

import { Button } from "@/presentation/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  search: string;
  category: string;
  sortBy: string;
  order: string;
}

export function Pagination({
  currentPage,
  totalPages,
  search,
  category,
  sortBy,
  order,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const createPageUrl = (page: number) => {
    const searchParams = new URLSearchParams();

    if (search) searchParams.set("search", search);
    if (category) searchParams.set("category", category);
    if (sortBy) searchParams.set("sortBy", sortBy);
    if (order) searchParams.set("order", order);

    searchParams.set("page", page.toString());

    return `${pathname}?${searchParams.toString()}`;
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(createPageUrl(page));
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show a subset of pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      <div className="flex items-center space-x-2">
        {pageNumbers.map((page, index) =>
          page === -1 ? (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => goToPage(page)}
              className="h-8 w-8"
            >
              {page}
            </Button>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
}
