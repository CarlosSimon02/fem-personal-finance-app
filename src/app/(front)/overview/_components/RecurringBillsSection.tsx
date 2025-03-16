import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import Link from "next/link";
import { getRecurringBillsData } from "../_data";

export async function RecurringBillsSection() {
  const { topBills } = await getRecurringBillsData();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Recurring Bills</CardTitle>
        <Link href="/bills" className="text-primary text-sm hover:underline">
          See Details
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topBills.map((bill) => (
            <div key={bill.id} className="flex items-center space-x-4">
              <div
                className="h-12 w-1 rounded-full"
                style={{ backgroundColor: bill.color }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{bill.name}</p>
                <p className="text-muted-foreground text-xs">{bill.dueDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium">
                  ₱{bill.amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
