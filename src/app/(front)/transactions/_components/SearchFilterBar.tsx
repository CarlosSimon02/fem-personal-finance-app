"use client";

import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FilterByCategory from "./FilterByCategory";
import SortSelector, { sortOptions } from "./SortSelector";

interface SearchFilterBarProps {
  search: string;
  category: string;
  sortBy: string;
  order: string;
}

export function SearchFilterBar({
  search: initialSearch,
  category: initialCategory,
  sortBy: initialSortBy,
  order: initialOrder,
}: SearchFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [order, setOrder] = useState(initialOrder);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== initialSearch) {
        updateUrl({ search });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [search, initialSearch]);

  // Update URL with new parameters
  const updateUrl = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams();

    // Add current params
    if (search && !("search" in params)) searchParams.set("search", search);
    if (category && !("category" in params))
      searchParams.set("category", category);
    if (sortBy && !("sortBy" in params)) searchParams.set("sortBy", sortBy);
    if (order && !("order" in params)) searchParams.set("order", order);

    // Add new params
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    });

    // Reset to page 1 when filters change
    if (!("page" in params)) {
      searchParams.delete("page");
    }

    const query = searchParams.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="sm:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle filters</span>
        </Button>
        <div className="hidden gap-2 sm:flex">
          <FilterByCategory
            value={
              category
                ? { value: category, label: category }
                : { value: "All Transactions", label: "All Transactions" }
            }
            onChange={(value) => {
              setCategory(value?.value ?? "");
              updateUrl({
                category:
                  value?.value === "All Transactions"
                    ? ""
                    : (value?.value ?? ""),
              });
            }}
          />
          <SortSelector
            value={
              sortBy && order
                ? {
                    value: `${sortBy}-${order}`,
                    label:
                      sortOptions.find(
                        (option) => option.value === `${sortBy}-${order}`
                      )?.label || "Latest",
                  }
                : { value: "transactionDate-desc", label: "Latest" }
            }
            onChange={(value) => {
              if (value) {
                const [newSortBy, newOrder] = value.value.split("-");
                setSortBy(newSortBy);
                setOrder(newOrder);
                updateUrl({ sortBy: newSortBy, order: newOrder });
              } else {
                setSortBy("");
                setOrder("");
                updateUrl({ sortBy: "", order: "" });
              }
            }}
          />
        </div>
      </div>

      {/* Mobile filters */}
      {isFilterOpen && (
        <div className="space-y-4 sm:hidden">
          <FilterByCategory
            value={category ? { value: category, label: category } : null}
            onChange={(value) => {
              setCategory(value?.value ?? "");
              updateUrl({ category: value?.value ?? "" });
            }}
          />
          <Select
            value={`${sortBy}-${order}`}
            onValueChange={(value) => {
              const [newSortBy, newOrder] = value.split("-");
              setSortBy(newSortBy);
              setOrder(newOrder);
              updateUrl({ sortBy: newSortBy, order: newOrder });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Date (Newest first)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest first)</SelectItem>
              <SelectItem value="amount-desc">
                Amount (Highest first)
              </SelectItem>
              <SelectItem value="amount-asc">Amount (Lowest first)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
