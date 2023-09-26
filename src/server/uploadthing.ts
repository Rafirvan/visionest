import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

const f = createUploadthing();


export const UploadRouter = {

    imageUploader: f({ image: { maxFileSize: "2MB" } })
        .onUploadComplete(({ file }) => {
            console.log("file url:", file.url);
        }),
} satisfies FileRouter;

export type UploadRouter = typeof UploadRouter;