import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  // Ensure the upload directory exists
  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

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
      const ext = file.filename.split(".").pop();
      const newFilename = `${randomUUID()}.${ext}`;
      const filePath = join(uploadDir, newFilename);

      await writeFile(filePath, file.data);
      uploadedUrls.push(`/uploads/${newFilename}`);
    }
  }

  return { urls: uploadedUrls };
});
