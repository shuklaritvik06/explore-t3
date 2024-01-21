import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { vote } from "./routers/vote";

export const appRouter = createTRPCRouter({
  post: postRouter,
  vote: vote,
});

export type AppRouter = typeof appRouter;
