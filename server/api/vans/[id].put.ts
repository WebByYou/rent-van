export default defineEventHandler(async (event) => {
  requireAuth(event);
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing ID" });
  }

  const van = await prisma.van.update({
    where: { id },
    data: body,
  });

  return van;
});
