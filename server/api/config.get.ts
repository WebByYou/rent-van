export default defineEventHandler(async (event) => {
  const configItems = await prisma.siteConfig.findMany();
  const config = configItems.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {} as Record<string, string>);

  return config;
});
