import { generateComponents } from "@uploadthing/react";

import type { UploadRouter } from "~/server/uploadthing";

export const { UploadButton, UploadDropzone, Uploader } =
    generateComponents<UploadRouter>();