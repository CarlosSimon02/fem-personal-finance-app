import {
  Card,
  CardContent,
  CardHeader,
} from "@/presentation/components/ui/card";
import { Separator } from "@/presentation/components/ui/separator";
import { Skeleton } from "@/presentation/components/ui/skeleton";

export function BudgetsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Spending Summary Card Skeleton */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Skeleton className="h-[200px] w-[200px] rounded-full" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-1 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="mt-2 h-2 w-full rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Cards Grid Skeleton */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-1 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-1 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-12" />
                  </div>

                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx}>
                        {idx > 0 && <Separator className="my-3" />}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="text-right">
                            <Skeleton className="ml-auto h-4 w-16" />
                            <Skeleton className="mt-1 ml-auto h-3 w-12" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-6 flex items-center justify-center space-x-2 py-4">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="flex items-center space-x-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-8 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export const BudgetCardsGridSkeleton = () => {
  return (
    <div className="lg:col-span-2">
      <div className="grid grid-cols-1 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-12" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-1 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-1 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>

                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx}>
                      {idx > 0 && <Separator className="my-3" />}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="text-right">
                          <Skeleton className="ml-auto h-4 w-16" />
                          <Skeleton className="mt-1 ml-auto h-3 w-12" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="mt-6 flex items-center justify-center space-x-2 py-4">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="flex items-center space-x-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-8 rounded-md" />
          ))}
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
};

export const SpendingSummaryCardSkeleton = () => {
  return (
    <div className="lg:col-span-1">
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-4" />}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-1 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="mt-2 h-2 w-full rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
