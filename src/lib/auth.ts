import { cookies } from "next/headers";

/**
 * Gets the userId from JWT token in cookies (if JWT is implemented)
 * Returns null if no valid token found or JWT is not implemented
 * Routes should fall back to reading userId from request body if this returns null
 */
export async function getUserIdFromToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    // Try to verify JWT token if jsonwebtoken is available
    try {
      const jwt = await import("jsonwebtoken");
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return null; // JWT_SECRET not set, JWT not fully implemented
      }
      const decoded = jwt.verify(token, secret) as { userId: string };
      return decoded.userId;
    } catch (error) {
      // jsonwebtoken package not installed or token invalid
      return null;
    }
  } catch (error) {
    // JWT not implemented or error reading cookies
    return null;
  }
}

