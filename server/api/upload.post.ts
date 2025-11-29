import { put } from "@vercel/blob";

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);
  if (!files || files.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "No files uploaded",
    });
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    if (file.filename) {
      // Upload to Vercel Blob
      const { url } = await put(file.filename, file.data, {
        access: "public",
      });
      uploadedUrls.push(url);
    }
  }

  return { urls: uploadedUrls };
});
