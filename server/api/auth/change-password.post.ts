import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Require authentication
  requireAuth(event);

  const body = await readBody(event);
  const { currentPassword, newPassword } = body;
  const config = useRuntimeConfig();

  if (!currentPassword || !newPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: "กรุณากรอกข้อมูลให้ครบถ้วน",
    });
  }

  // 1. Verify current password
  const dbConfig = await prisma.siteConfig.findUnique({
    where: { key: "admin_password_hash" },
  });

  let isValid = false;

  if (dbConfig && dbConfig.value) {
    isValid = await bcrypt.compare(currentPassword, dbConfig.value);
  } else {
    isValid = currentPassword === "admin";
  }

  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: "รหัสผ่านปัจจุบันไม่ถูกต้อง",
    });
  }

  // 2. Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // 3. Save to database
  await prisma.siteConfig.upsert({
    where: { key: "admin_password_hash" },
    update: { value: hashedPassword },
    create: { key: "admin_password_hash", value: hashedPassword },
  });

  return { success: true };
});
