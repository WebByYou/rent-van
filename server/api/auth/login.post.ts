import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const { username, password } = body;

  // 1. Check for password hash in database
  const dbConfig = await prisma.siteConfig.findUnique({
    where: { key: "admin_password_hash" },
  });

  let isValid = false;

  if (dbConfig && dbConfig.value) {
    // Compare with hash
    isValid = await bcrypt.compare(password, dbConfig.value);
  } else {
    // Fallback to env password
    isValid = password === config.adminPassword;
  }

  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: "รหัสผ่านไม่ถูกต้อง",
    });
  }

  // สร้าง JWT
  const token = jwt.sign(
    { username: "admin", role: "admin" },
    config.jwtSecret,
    {
      expiresIn: "1d",
    }
  );

  // ตั้งค่า cookie
  setCookie(event, "auth_token", token, {
    httpOnly: false, // อนุญาตให้ client-side เข้าถึงได้เพื่อแก้ปัญหา hydration mismatch
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return { success: true };
});
