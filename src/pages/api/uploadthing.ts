import { createNextPageApiHandler } from "uploadthing/next-legacy";

import { UploadRouter } from "~/server/uploadthing";

const handler = createNextPageApiHandler({
    router: UploadRouter,
});

export default handler;