import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const vote = createTRPCRouter({
  addVote: protectedProcedure
    .input(
      z.object({ voteType: z.enum(["Like", "Dislike"]), postId: z.number() }),
    )
    .mutation(async ({ ctx, input }) => {
      const voting = await ctx.db.vote.findFirst({
        where: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
      if (voting) {
        await ctx.db.vote.delete({
          where: {
            id: voting.id,
          },
        });
      }
      await ctx.db.vote.create({
        data: {
          vote: input.voteType,
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
    }),
});
