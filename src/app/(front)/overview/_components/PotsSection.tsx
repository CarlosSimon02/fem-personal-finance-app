import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import Link from "next/link";
import { getPotsData } from "../_data";

export async function PotsSection() {
  const { totalSaved, topPots } = await getPotsData();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Pots</CardTitle>
        <Link href="/pots" className="text-primary text-sm hover:underline">
          See Details
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Total Saved</p>
                <p className="text-2xl font-bold">
                  ₱{totalSaved.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {topPots.map((pot) => (
              <div key={pot.id} className="flex items-center space-x-4">
                <div
                  className="h-12 w-1 rounded-full"
                  style={{ backgroundColor: pot.color }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{pot.name}</p>
                  <p className="text-muted-foreground text-sm">
                    ₱{pot.saved.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
