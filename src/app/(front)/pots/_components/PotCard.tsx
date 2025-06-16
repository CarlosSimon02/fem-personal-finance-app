import { PotDto } from "@/core/schemas/potSchema";
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
import { MoreHorizontal } from "lucide-react";

interface PotCardProps {
  pot: PotDto;
}

export function PotCard({ pot }: PotCardProps) {
  // Calculate percentage of target reached
  const targetAmount = pot.target || 100000; // Default target if not specified
  const percentSaved = (pot.totalSaved / targetAmount) * 100;
  const formattedPercentage = percentSaved.toFixed(1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: pot.colorTag }}
          />
          <h3 className="font-medium">{pot.name}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit pot</DropdownMenuItem>
            <DropdownMenuItem>Delete pot</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">Total Saved</p>
          <p className="text-2xl font-bold">
            ₱{pot.totalSaved.toLocaleString()}
          </p>
        </div>

        <div className="space-y-2">
          <div className="bg-muted h-2 w-full rounded-full">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${Math.min(100, percentSaved)}%`,
                backgroundColor: pot.colorTag,
              }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span>{formattedPercentage}%</span>
            <span className="text-muted-foreground">
              Target of ₱{targetAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="w-full">
            Add Money
          </Button>
          <Button variant="outline" className="w-full">
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
