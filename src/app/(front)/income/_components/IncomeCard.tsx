import { IncomeWithTransactionsDto } from "@/core/schemas/incomeSchema";
import TransactionEmoji from "@/presentation/components/TransactionEmoji";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/presentation/components/ui/card";
import { Separator } from "@/presentation/components/ui/separator";
import Link from "next/link";
import IncomeCardActions from "./IncomeCardActions";

interface IncomeCardProps {
  income: IncomeWithTransactionsDto;
}

export function IncomeCard({ income }: IncomeCardProps) {
  const transactions = income.transactions;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: income.colorTag }}
          />
          <h3 className="font-medium">{income.name}</h3>
        </div>
        <IncomeCardActions income={income} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Earned</p>
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-1 rounded-full"
                style={{ backgroundColor: income.colorTag }}
              />
              <p className="font-medium">
                ₱{Math.abs(income.totalEarned).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {transactions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Latest Earnings</h4>
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
                      <p className="text-sm font-medium text-green-600">
                        ₱{Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {transaction.transactionDate.toLocaleDateString()}
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
