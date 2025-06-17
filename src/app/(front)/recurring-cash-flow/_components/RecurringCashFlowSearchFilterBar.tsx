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

interface RecurringCashFlowSearchFilterBarProps {
  search: string;
  type: string;
  status: string;
  sortBy: string;
  order: string;
}

export default function RecurringCashFlowSearchFilterBar({
  search: initialSearch,
  type: initialType,
  status: initialStatus,
  sortBy: initialSortBy,
  order: initialOrder,
}: RecurringCashFlowSearchFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(initialSearch);
  const [type, setType] = useState(initialType);
  const [status, setStatus] = useState(initialStatus);
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
    if (type && type !== "all" && !("type" in params)) {
      searchParams.set("type", type);
    }
    if (status && status !== "all" && !("status" in params)) {
      searchParams.set("status", status);
    }
    if (sortBy && !("sortBy" in params)) searchParams.set("sortBy", sortBy);
    if (order && !("order" in params)) searchParams.set("order", order);

    // Add new params
    Object.entries(params).forEach(([key, value]) => {
      if (
        value &&
        !(key === "type" && value === "all") &&
        !(key === "status" && value === "all")
      ) {
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
            placeholder="Search recurring cash flows..."
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
          {/* Type Filter */}
          <Select
            value={type || "all"}
            onValueChange={(value) => {
              const newType = value === "all" ? "" : value;
              setType(newType);
              updateUrl({ type: newType });
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={status || "all"}
            onValueChange={(value) => {
              const newStatus = value === "all" ? "" : value;
              setStatus(newStatus);
              updateUrl({ status: newStatus });
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Filter */}
          <Select
            value={`${sortBy}-${order}`}
            onValueChange={(value) => {
              const [newSortBy, newOrder] = value.split("-");
              setSortBy(newSortBy);
              setOrder(newOrder);
              updateUrl({ sortBy: newSortBy, order: newOrder });
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Latest</SelectItem>
              <SelectItem value="createdAt-asc">Oldest</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="amount-desc">Amount (High-Low)</SelectItem>
              <SelectItem value="amount-asc">Amount (Low-High)</SelectItem>
              <SelectItem value="nextDue-asc">Next Due</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile filters */}
      {isFilterOpen && (
        <div className="space-y-4 sm:hidden">
          <Select
            value={type || "all"}
            onValueChange={(value) => {
              const newType = value === "all" ? "" : value;
              setType(newType);
              updateUrl({ type: newType });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={status || "all"}
            onValueChange={(value) => {
              const newStatus = value === "all" ? "" : value;
              setStatus(newStatus);
              updateUrl({ status: newStatus });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>

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
              <SelectItem value="createdAt-desc">Latest</SelectItem>
              <SelectItem value="createdAt-asc">Oldest</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="amount-desc">Amount (High-Low)</SelectItem>
              <SelectItem value="amount-asc">Amount (Low-High)</SelectItem>
              <SelectItem value="nextDue-asc">Next Due</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
