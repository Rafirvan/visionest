import { createTRPCRouter } from "~/server/api/trpc";
import { AIRouter } from './TRPCrouters/OpenAI';
import { DBRouter } from "./TRPCrouters/Dbcall";
import { APIRouter } from "./TRPCrouters/APIKeys";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  completion: AIRouter,
  db: DBRouter,
  key: APIRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;