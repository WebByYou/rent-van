export default defineEventHandler(async (event) => {
  requireAuth(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing ID" });
  }

  await prisma.van.delete({
    where: { id },
  });

  return { success: true };
});
