export default defineEventHandler(async (event) => {
  requireAuth(event);
  const body = await readBody(event);

  // Expect body to be { key: value, key2: value2 }
  const updates = [];
  for (const [key, value] of Object.entries(body)) {
    updates.push(
      prisma.siteConfig.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );
  }

  await prisma.$transaction(updates);

  return { success: true };
});
