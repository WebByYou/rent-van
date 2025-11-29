import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const vans = await prisma.van.findMany();
  console.log(JSON.stringify(vans, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
