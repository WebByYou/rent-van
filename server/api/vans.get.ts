export default defineEventHandler(async (event) => {
  const vans = await prisma.van.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return vans;
});
