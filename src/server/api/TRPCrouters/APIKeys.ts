//unused


import {
    createTRPCRouter,
    publicProcedure
} from "~/server/api/trpc";
import { env } from "~/env.mjs";

export const APIRouter = createTRPCRouter({
    tinyMCE: publicProcedure.query(() => env.TINYMCE_KEY)
})