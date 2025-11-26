import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const { username, password } = body;

  // Simple check against env variable for now, as requested.
  // In a real app, we would check the Admin table in DB.
  if (password !== config.adminPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: Invalid password",
    });
  }

  // Create JWT
  const token = jwt.sign(
    { username: "admin", role: "admin" },
    config.jwtSecret,
    {
      expiresIn: "1d",
    }
  );

  // Set cookie
  setCookie(event, "auth_token", token, {
    httpOnly: false, // Allow client-side access to fix hydration mismatch
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return { success: true };
});
