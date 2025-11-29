import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { ids } = body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "IDs array is required and must not be empty",
    });
  }

  try {
    const result = await prisma.van.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return {
      success: true,
      count: result.count,
      message: `Deleted ${result.count} vans successfully`,
    };
  } catch (error) {
    console.error("Error bulk deleting vans:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
