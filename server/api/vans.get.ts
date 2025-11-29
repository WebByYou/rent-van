export default defineCachedEventHandler(
  async (event) => {
    const query = getQuery(event);
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search?.toString() || "";
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { plateNumber: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    try {
      const [vans, total] = await prisma.$transaction([
        prisma.van.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.van.count({ where }),
      ]);

      return {
        data: vans,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching vans:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
  {
    maxAge: 60,
    name: "vans-list",
    getKey: (event) => {
      const query = getQuery(event);
      return `vans-${query.page || 1}-${query.limit || 10}-${
        query.search || ""
      }`;
    },
  }
);
