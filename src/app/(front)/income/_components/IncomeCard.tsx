import TransactionEmoji from "@/presentation/components/TransactionEmoji";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/presentation/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { Separator } from "@/presentation/components/ui/separator";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Budget, getBudgetTransactions } from "../../overview/_data";

interface BudgetCardProps {
  budget: Budget;
}

export async function IncomeCard({ budget }: BudgetCardProps) {
  const { transactions } = await getBudgetTransactions(budget.id);
  const remaining = budget.limit - budget.spent;
  const percentSpent = (budget.spent / budget.limit) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: budget.color }}
          />
          <h3 className="font-medium">{budget.name}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit budget</DropdownMenuItem>
            <DropdownMenuItem>Delete budget</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">
            Maximum of ₱{budget.limit.toLocaleString()}
          </p>
          <div className="bg-muted h-2 w-full rounded-full">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${Math.min(100, percentSpent)}%`,
                backgroundColor: budget.color,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Spent</p>
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-1 rounded-full"
                style={{ backgroundColor: budget.color }}
              />
              <p className="font-medium">₱{budget.spent.toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Remaining</p>
            <div className="flex items-center gap-2">
              <div className="bg-muted h-8 w-1 rounded-full" />
              <p className="font-medium">₱{remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {transactions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Latest Spending</h4>
              <Link href="#" className="text-primary text-xs hover:underline">
                See all
              </Link>
            </div>

            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div key={transaction.id}>
                  {index > 0 && <Separator className="my-3" />}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TransactionEmoji emoji={transaction.emoji} />
                      <span className="text-sm">{transaction.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        -₱{Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
