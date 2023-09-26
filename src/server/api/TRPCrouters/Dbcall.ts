import { z } from "zod";
import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";



export const DBRouter = createTRPCRouter({


    submit: privateProcedure.input(z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        authors: z.string().min(1),
        year: z.number(),
        link: z.string().url(),
        university: z.string(),
        imageurl: z.string()

    })).mutation(async ({ ctx, input }) => {

        const post = await ctx.prisma.post.create({
            data: {
                creatorID: ctx.userId,
                title: input.title,
                description: input.description,
                year: input.year,
                authors: input.authors,
                originlink: input.link,
                university: input.university,
                imageURL: input.imageurl,
                status: "PENDING",
                favcount: 0,
                rejection: ""
            }

        })
        return post
    }),

    edit: privateProcedure.input(z.object({
        id: z.string(),
        title: z.string().min(1),
        description: z.string().min(1),
        authors: z.string().min(1),
        year: z.number(),
        link: z.string().url(),
        university: z.string(),
        imageurl: z.string()

    })).mutation(async ({ ctx, input }) => {

        const post = await ctx.prisma.post.update({
            where: { id: input.id },
            data: {
                creatorID: ctx.userId,
                title: input.title,
                description: input.description,
                year: input.year,
                authors: input.authors,
                originlink: input.link,
                university: input.university,
                imageURL: input.imageurl,
                status: "PENDING",
                favcount: 0,
                rejection: ""
            }

        })
        await prisma.posttag.deleteMany({
            where: {
                postId: input.id
            }
        });

        return post
    }),

    // admin routers
    callpostforadmin: publicProcedure.mutation(async () => {
        const posts = await prisma.post.findMany({
            where: {
                status: "PENDING"
            },
            select: {
                id: true,
                title: true
            }
        })
        const postDatas = posts.map(post => ({ id: post.id, title: post.title }))
        return postDatas
    }
    ),
    acceptpost: privateProcedure.input(z.object({
        id: z.string(),
        tags: z.array(z.string())
    })).mutation(async ({ input }) => {
        await prisma.post.update({
            where: {
                id: input.id
            },
            data: {
                status: "ACCEPTED"
            }
        })
        for (const tagName of input.tags) {
            const tag = await prisma.tag.findUnique({ where: { name: tagName } });

            if (tag) {
                await prisma.posttag.create({
                    data: {
                        postId: input.id,
                        tagId: tag.id
                    }
                });
            }
        }
    }),

    rejectpost: privateProcedure.input(z.object({ id: z.string(), rejectionmessage: z.string() })).mutation(async ({ input }) => {
        await prisma.post.update({
            where: {
                id: input.id
            },
            data: {
                status: "REJECTED",
                rejection: input.rejectionmessage
            }
        })
    }),

    //used by card and post pages
    callpostfromid: publicProcedure.input(z.string()).mutation(async ({ input }) => {
        const postwithid = await prisma.post.findUnique({
            where: {
                id: input
            },
        })
        return postwithid
    }),

    savepost: privateProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
        const save = await prisma.userfavpost.create({
            data: {
                userID: ctx.userId,
                postID: input,
            },
            select: {
                favID: true
            }
        })
        return save
    }),

    checksave: privateProcedure.mutation(async ({ ctx }) => {
        const check = await prisma.userfavpost.findMany({
            where: {
                userID: ctx.userId
            },
            select: {
                postID: true
            }
        })
        return check.map(e => e.postID)
    }),

    unsavepost: privateProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
        const unsave = await prisma.userfavpost.deleteMany({
            where: {
                userID: ctx.userId,
                postID: input,
            },
        })
        return unsave
    }),


    //for nest and carousel
    callpostid: publicProcedure.input(z.object({
        many: z.number(),
        cursor: z.number().nullish()
    })).query(async ({ input }) => {
        const { many } = input
        const postids = await prisma.post.findMany({
            where: {
                status: "ACCEPTED"
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: many,
            select: {
                id: true
            }
        })

        return postids.map((e) => e.id)
    }
    ),

    callfavpostid: privateProcedure.mutation(async ({ ctx }) => {
        const favpostids = await prisma.userfavpost.findMany({
            where: {
                userID: ctx.userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                postID: true
            }
        })
        return favpostids.map((e) => e.postID)
    }),

    callyourpostid: privateProcedure.mutation(async ({ ctx }) => {
        const yourpostids = await prisma.post.findMany({
            where: {
                creatorID: ctx.userId
            },
            orderBy: [
                { status: "desc" },
                {
                    createdAt: 'desc'
                },

            ],
            select: {
                id: true
            }
        })
        return yourpostids.map((e) => e.id)
    })


})

