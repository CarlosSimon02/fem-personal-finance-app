import { Card, CardContent } from "@/presentation/components/ui/card";
import { getSummaryData } from "../_data";

export async function SummarySection() {
  const { balance, income, expenses } = await getSummaryData();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Current Balance</p>
            <p className="text-2xl font-bold">₱{balance.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Income</p>
            <p className="text-2xl font-bold text-green-600">
              ₱{income.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              ₱{expenses.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
