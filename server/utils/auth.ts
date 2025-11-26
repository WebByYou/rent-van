import jwt from "jsonwebtoken";
import { H3Event } from "h3";

export const requireAuth = (event: H3Event) => {
  const config = useRuntimeConfig();
  const token = getCookie(event, "auth_token");

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    // You can attach user to event.context if needed
    event.context.auth = decoded;
    return decoded;
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: Invalid token",
    });
  }
};
