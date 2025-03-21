import TransactionEmoji from "@/presentation/components/TransactionEmoji";
import { Button } from "@/presentation/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { getFilteredTransactions } from "../../overview/_data";
import { Pagination } from "./Pagination";

interface TransactionsTableProps {
  search: string;
  category: string;
  sortBy: string;
  order: string;
  page: number;
}

export async function TransactionsTable({
  search,
  category,
  sortBy,
  order,
  page,
}: TransactionsTableProps) {
  // Fetch and process data on the server
  const { transactions, totalPages } = await getFilteredTransactions({
    search,
    category,
    sortBy,
    order,
    page,
  });

  return (
    <div className="space-y-4">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="px-4 py-3 text-left font-medium">
                  Recipient/Sender
                </th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">
                  Transaction Date
                </th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                <th className="w-[50px] px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <TransactionEmoji emoji={transaction.emoji} />
                      <span className="font-medium">{transaction.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-muted inline-flex items-center rounded-full px-2 py-1 text-xs">
                      {transaction.category.name}
                    </span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {transaction.amount > 0 ? "+" : ""}₱
                      {Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Download receipt</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="space-y-4 md:hidden">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-start gap-3">
              <TransactionEmoji emoji={transaction.emoji} />
              <div>
                <p className="font-medium">{transaction.name}</p>
                <span className="bg-muted mt-1 inline-flex items-center rounded-full px-2 py-1 text-xs">
                  {transaction.category.name}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={
                  transaction.amount > 0
                    ? "font-medium text-green-600"
                    : "font-medium text-red-600"
                }
              >
                {transaction.amount > 0 ? "+" : ""}₱
                {Math.abs(transaction.amount).toLocaleString()}
              </span>
              <span className="text-muted-foreground mt-1 text-xs">
                {transaction.date}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2 h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>Download receipt</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          search={search}
          category={category}
          sortBy={sortBy}
          order={order}
        />
      )}
    </div>
  );
}
