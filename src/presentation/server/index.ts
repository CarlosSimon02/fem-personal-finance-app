import { paginationParamsSchema } from "@/core/schemas/paginationSchema";
import {
  getBudgetsSummaryUseCase,
  getPaginatedBudgetsUseCase,
  getPaginatedBudgetsWithTransactionsUseCase,
} from "@/factories/budget";
import { protectedProcedure, router } from "./trpc";

export const appRouter = router({
  getBudgetsSummary: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    const response = await getBudgetsSummaryUseCase.execute(user.id);
    return response;
  }),
  getPaginatedBudgetsWithTransactions: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const response = await getPaginatedBudgetsWithTransactionsUseCase.execute(
        user.id,
        input
      );
      return response;
    }),
  getPaginatedBudgets: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const response = await getPaginatedBudgetsUseCase.execute(user.id, input);
      return response;
    }),
});

export type AppRouter = typeof appRouter;
