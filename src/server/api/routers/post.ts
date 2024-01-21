import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(
      z.object({
        title: z.string().min(20),
        postBody: z.string().min(20),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          title: input.title,
          postBody: input.postBody,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  listPost: publicProcedure
    .input(
      z.object({
        start: z.number(),
        pageSize: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        skip: input.start,
        take: input.pageSize,
        include: {
          Votes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const totalPosts = await ctx.db.post.count();
      const totalPages = Math.ceil(totalPosts / input.pageSize);
      const result = {
        posts,
        totalPages,
      };
      return result;
    }),
  deletePost: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.post.delete({
        where: {
          id: input.id,
          createdById: ctx.session.user.id,
        },
      });
    }),
  editPost: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(20),
        postBody: z.string().min(20),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.post.update({
        where: {
          id: 1,
        },
        data: { title: input.title, postBody: input.postBody },
      });
    }),
});
