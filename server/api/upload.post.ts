export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const files = await readMultipartFormData(event);

  if (!files || files.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "No files uploaded",
    });
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    if (file.filename && file.data) {
      // Convert buffer to base64
      const base64Image = file.data.toString("base64");

      try {
        const formData = new FormData();
        formData.append("key", config.imgbbApiKey);
        formData.append("image", base64Image);

        const response = await $fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });

        if (response && response.data && response.data.url) {
          uploadedUrls.push(response.data.url);
        }
      } catch (error) {
        console.error("ImgBB Upload Error:", error);
        throw createError({
          statusCode: 500,
          statusMessage: "Failed to upload image to ImgBB",
        });
      }
    }
  }

  return { urls: uploadedUrls };
});
