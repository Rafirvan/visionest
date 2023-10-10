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
                rejection: "",
                posttag: undefined
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
            select: {
                id: true,
                title: true,
                creatorID: true,
                description: true,
                authors: true,
                year: true,
                originlink: true,
                imageURL: true,
                status: true,
                rejection: true,
                university: true,
                posttag: {
                    select: {
                        tag: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
            }
        });

        return { postwithid }
    }),

    favcount: publicProcedure.input(z.string()).mutation(async ({ input }) => {

        const favs = await prisma.userfavpost.findMany({
            where: {
                postID: input
            }
        });

        return favs.length
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
        limit: z.number(),
        cursor: z.string().nullish()
    })).query(async ({ input }) => {
        const { limit, cursor } = input
        const newLimit = limit+1
        const postids = await prisma.post.findMany({
            where: {
                status: "ACCEPTED"
            },
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: {
                createdAt: 'desc'
            },
            take: newLimit,
            select: {
                id: true
            }
        })
        const totalDataCount = await prisma.post.count({ where: { status: "ACCEPTED" } });

        let newCursor = undefined
        if (postids.length > limit) {
            const nextItem = postids.pop();
            newCursor = nextItem!.id;
        }

        return { id:postids.map((e) => e.id), nextCursor:newCursor, count:totalDataCount }
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

    callyourpostid: privateProcedure.query(async ({ ctx }) => {
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
    }),

    callforsearch: publicProcedure.query(async () => {
        const searched = await prisma.post.findMany({
            where: { status: "ACCEPTED" },
            select: {
                id: true,
                title: true,
                authors: true,
                university: true,
                posttag: {
                    select: {
                        tag: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                imageURL: true
            }
        })
        return searched
    }),

    visionrate: publicProcedure.input(z.object({ input: z.string(), output: z.string(), rating: z.number() })).mutation(async ({ input }) => {
            await prisma.visionscore.create({
                data: {
                    input: input.input,
                    output: input.output,
                    score: input.rating
            },
        })
        
               
    }),

    descriptionrate: publicProcedure.input(z.object({ input: z.string(), output: z.string(), rating: z.number() })).mutation(async ({ input }) => {
        await prisma.descriptionscore.create({
            data: {
                input: input.input,
                output: input.output,
                score: input.rating
            },
        })


    })


})


//HELLO