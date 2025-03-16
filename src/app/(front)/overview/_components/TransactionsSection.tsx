import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { getTransactionsData } from "../_data";

export async function TransactionsSection() {
  const { recentTransactions } = await getTransactionsData();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Transactions</CardTitle>
        <Link
          href="/transactions"
          className="text-primary text-sm hover:underline"
        >
          See Details
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center space-x-4">
              <Image
                src={transaction.image || "/placeholder.svg"}
                alt={transaction.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{transaction.name}</p>
                <p className="text-muted-foreground text-xs">
                  {transaction.date}
                </p>
              </div>
              <div
                className={
                  transaction.amount > 0 ? "text-green-600" : "text-red-600"
                }
              >
                <p className="text-sm font-medium">
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
