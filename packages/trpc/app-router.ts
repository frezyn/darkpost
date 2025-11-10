import { publicroutes } from "./server/routes/publicRoutes";
import { mergeRoutes } from "./server/trpc";

export const appRouter = mergeRoutes(publicroutes)
export type AppRouter = typeof appRouter;
