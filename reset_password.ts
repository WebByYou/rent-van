import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Resetting admin password...");

  try {
    const deleted = await prisma.siteConfig.delete({
      where: { key: "admin_password_hash" },
    });
    console.log("✅ Admin password hash DELETED.");
    console.log("Password has been reset to default: 'admin'");
  } catch (e: any) {
    if (e.code === "P2025") {
      console.log("ℹ️ No admin password hash found to delete.");
      console.log("Password should already be default: 'admin'");
    } else {
      throw e;
    }
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
