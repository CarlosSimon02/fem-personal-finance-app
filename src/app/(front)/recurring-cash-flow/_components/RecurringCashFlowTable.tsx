"use client";

import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { faker } from "@faker-js/faker";
import { addDays, format } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  MoreHorizontal,
  Pause,
  Play,
  Trash2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface RecurringCashFlowTableProps {
  search: string;
  type: string;
  status: string;
  sortBy: string;
  order: string;
  page: number;
}

// Generate fake data with better realistic data
const generateFakeData = (count: number = 25) => {
  const incomeNames = [
    "Salary",
    "Freelance",
    "Investment",
    "Rental Income",
    "Side Hustle",
    "Bonus",
    "Consulting",
  ];
  const expenseNames = [
    "Rent",
    "Utilities",
    "Groceries",
    "Car Payment",
    "Insurance",
    "Internet",
    "Phone",
    "Gym",
    "Streaming",
    "Mortgage",
  ];
  const emojis = ["💰", "🏠", "⚡", "🚗", "🍔", "💻", "📱", "🎵", "🏥", "🎓"];
  const frequencies = ["Daily", "Weekly", "Monthly", "Yearly"];
  const statuses = ["active", "paused"] as const;
  const types = ["income", "expense"] as const;

  return Array.from({ length: count }, () => {
    const type = faker.helpers.arrayElement(types);
    const status = faker.helpers.arrayElement(statuses);
    const frequency = faker.helpers.arrayElement(frequencies);

    // Generate realistic amounts based on type
    const amount =
      type === "income"
        ? faker.number.int({ min: 1000, max: 8000 })
        : faker.number.int({ min: 50, max: 2000 });

    // Generate next run date (within next 30 days)
    const nextRunDate = addDays(
      new Date(),
      faker.number.int({ min: 1, max: 30 })
    );

    const names = type === "income" ? incomeNames : expenseNames;

    return {
      id: faker.string.uuid(),
      name: faker.helpers.arrayElement(names),
      type,
      amount,
      frequency,
      nextRunDate,
      status,
      emoji: faker.helpers.arrayElement(emojis),
      createdAt: faker.date.past(),
    };
  });
};

const RecurringCashFlowTable = ({
  search,
  type,
  status,
  sortBy,
  order,
  page,
}: RecurringCashFlowTableProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Generate and filter fake data
  let data = generateFakeData();

  // Apply filters
  if (search) {
    data = data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (type && type !== "all") {
    data = data.filter((item) => item.type === type);
  }
  if (status && status !== "all") {
    data = data.filter((item) => item.status === status);
  }

  // Apply sorting
  data.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "amount":
        comparison = a.amount - b.amount;
        break;
      case "nextDue":
        comparison = a.nextRunDate.getTime() - b.nextRunDate.getTime();
        break;
      case "createdAt":
      default:
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
    }
    return order === "desc" ? -comparison : comparison;
  });

  // Pagination
  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleAction = (action: string, id: string) => {
    console.log(`${action} action for cash flow ${id}`);
  };

  // Pagination functions
  const createPageUrl = (newPage: number) => {
    const searchParams = new URLSearchParams();
    if (search) searchParams.set("search", search);
    if (type && type !== "all") searchParams.set("type", type);
    if (status && status !== "all") searchParams.set("status", status);
    if (sortBy) searchParams.set("sortBy", sortBy);
    if (order) searchParams.set("order", order);
    searchParams.set("page", newPage.toString());
    return `${pathname}?${searchParams.toString()}`;
  };

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(createPageUrl(newPage));
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Empty state
  if (paginatedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="mb-2 text-lg font-medium">
          No recurring cash flows found
        </h3>
        <p className="text-muted-foreground">
          {search || type !== "all" || status !== "all"
            ? "Try adjusting your search or filters"
            : "Create your first recurring cash flow to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                  Name
                </th>
                <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                  Amount
                </th>
                <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                  Frequency
                </th>
                <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                  Next Run
                </th>
                <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                  Status
                </th>
                <th className="text-muted-foreground h-12 w-12 px-4 text-left align-middle font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((flow) => (
                <tr
                  key={flow.id}
                  className="hover:bg-muted/50 border-b transition-colors"
                >
                  <td className="h-16 px-4 align-middle">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{flow.emoji}</span>
                      <span className="font-medium">{flow.name}</span>
                    </div>
                  </td>
                  <td className="h-16 px-4 align-middle">
                    <span
                      className={`font-semibold ${
                        flow.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {flow.type === "income" ? "+" : "-"}₱
                      {flow.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="text-muted-foreground h-16 px-4 align-middle">
                    {flow.frequency}
                  </td>
                  <td className="h-16 px-4 align-middle text-sm">
                    {format(flow.nextRunDate, "MMM dd, yyyy")}
                  </td>
                  <td className="h-16 px-4 align-middle">
                    <Badge
                      variant={
                        flow.status === "active" ? "default" : "secondary"
                      }
                    >
                      {flow.status === "active" ? "Active" : "Paused"}
                    </Badge>
                  </td>
                  <td className="h-16 px-4 align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleAction("edit", flow.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleAction(
                              flow.status === "active" ? "pause" : "resume",
                              flow.id
                            )
                          }
                        >
                          {flow.status === "active" ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Resume
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("delete", flow.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {paginatedData.map((flow) => (
          <Card key={flow.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-1 items-center gap-3">
                  <span className="text-xl">{flow.emoji}</span>
                  <div className="flex-1">
                    <h4 className="font-medium">{flow.name}</h4>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant={
                          flow.status === "active" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {flow.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleAction("edit", flow.id)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleAction(
                          flow.status === "active" ? "pause" : "resume",
                          flow.id
                        )
                      }
                    >
                      {flow.status === "active" ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Resume
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAction("delete", flow.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p
                    className={`font-semibold ${
                      flow.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {flow.type === "income" ? "+" : "-"}₱
                    {flow.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Frequency</p>
                  <p>{flow.frequency}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Next Run</p>
                  <p>{format(flow.nextRunDate, "MMM dd, yyyy")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          <div className="flex items-center space-x-2">
            {pageNumbers.map((pageNum, index) =>
              pageNum === -1 ? (
                <span key={`ellipsis-${index}`} className="px-2">
                  ...
                </span>
              ) : (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="icon"
                  onClick={() => goToPage(pageNum)}
                  className="h-8 w-8"
                >
                  {pageNum}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecurringCashFlowTable;
