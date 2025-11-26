import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const slug = getRouterParam(event, "slug");
  const body = await readBody(event);

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Slug is required",
    });
  }

  const page = await prisma.page.upsert({
    where: { slug },
    update: {
      title: body.title,
      content: body.content,
    },
    create: {
      slug,
      title: body.title,
      content: body.content,
    },
  });

  return page;
});
