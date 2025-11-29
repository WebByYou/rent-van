import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const { username, password } = body;

  // ตรวจสอบรหัสผ่านจาก environment variable
  // ในแอปจริง ควรตรวจสอบจากตาราง Admin ในฐานข้อมูล
  if (password !== config.adminPassword) {
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
