import { Suspense } from "react";
import { BudgetsSection } from "./_components/BudgetsSection";
import { OverviewSkeleton } from "./_components/OverviewSkeleton";
import { PotsSection } from "./_components/PotsSection";
import { RecurringBillsSection } from "./_components/RecurringBillsSection";
import { SummarySection } from "./_components/SummarySection";
import { TransactionsSection } from "./_components/TransactionsSection";

const OverviewPage = () => {
  return (
    <div className="container space-y-6 py-6">
      <h1 className="text-3xl font-bold">Overview</h1>

      <Suspense fallback={<OverviewSkeleton />}>
        <div className="space-y-6">
          <SummarySection />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <PotsSection />
              <TransactionsSection />
            </div>

            <div className="space-y-6">
              <BudgetsSection />
              <RecurringBillsSection />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default OverviewPage;
