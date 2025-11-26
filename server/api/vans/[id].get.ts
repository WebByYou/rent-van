import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID is required",
    });
  }

  const van = await prisma.van.findUnique({
    where: { id },
  });

  if (!van) {
    throw createError({
      statusCode: 404,
      statusMessage: "Van not found",
    });
  }

  return van;
});
