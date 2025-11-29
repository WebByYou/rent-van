import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking for admin_password_hash...");
  const config = await prisma.siteConfig.findUnique({
    where: { key: "admin_password_hash" },
  });

  if (config) {
    console.log("✅ Admin password hash FOUND.");
    console.log("Value:", config.value);
  } else {
    console.log("❌ No admin password hash found.");
    console.log("Default password 'admin' should be active.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
