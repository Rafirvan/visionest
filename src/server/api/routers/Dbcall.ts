import { z } from "zod";
import {
    createTRPCRouter,
    privateProcedure,
} from "~/server/api/trpc";



export const DBRouter = createTRPCRouter({



    submit: privateProcedure.input(z.object({
        title: z.string().min(1).max(80),
        description: z.string().min(1).max(500),
        authors: z.string().min(1).max(80),
        year: z.number(),
        link: z.string(),
        imageurl: z.string()

    })).mutation(async ({ ctx, input }) => {

        const post = await ctx.prisma.post.create({
            data: {
                userID: ctx.userId,
                title: input.title,
                description: input.description,
                year: input.year,
                authors: input.authors,
                originlink: input.link,
                imageURL: input.imageurl,
                status: "PENDING",
                favcount: 0
            }

        })
        return post
    })

})
