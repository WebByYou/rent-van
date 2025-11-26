import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Slug is required",
    });
  }

  const page = await prisma.page.findUnique({
    where: { slug },
  });

  if (!page) {
    // Return empty content if not found, easier for frontend to handle "create new" logic
    return {
      slug,
      title: "",
      content: "",
    };
  }

  return page;
});
