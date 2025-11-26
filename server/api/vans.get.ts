export default defineEventHandler(async (event) => {
  try {
    const vans = await prisma.van.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return vans;
  } catch (error) {
    console.error("Error fetching vans:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
