import { createTRPCRouter } from "~/server/api/trpc";
import { AIRouter } from './routers/OpenAI';
import { DBRouter } from "./routers/Dbcall";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  completion: AIRouter,
  db: DBRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;