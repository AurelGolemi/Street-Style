import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

const JWT_EXPIRES_IN = "7d";

// Type Definitions
export interface TokenPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
}

export interface DecodedToken extends TokenPayload {
  iat: number; // Issued at (timestamp)
  exp: number; // Expiration (timestamp)
}

export function generateToken(payload: TokenPayload): string {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      algorithm: "HS256", // HMAC with SHA-256
    });

    return token;
  } catch (error) {
    console.error("JWT Generation Error:", error);
    throw new Error("Failed to generate authentication token");
  }
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log("Token expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log("Invalid token");
    }
    return null;
  }
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.decode(token) as DecodedToken;
    return decoded;
  } catch {
    return null;
  }
}

export function refreshToken(oldToken: string): string | null {
  const decoded = verifyToken(oldToken);

  if (!decoded) {
    return null;
  }

  const newToken = generateToken({
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  });

  return newToken;
}

export function extractTokenFromCookie(cookieHeader: string | undefined) {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const sessionCookie = cookies.find((c) => c.startsWith("session="));

  if (!sessionCookie) return null;

  return sessionCookie.split("=")[1];
}

export function createSecureCookie(token: string): string {
  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds

  const secureParts = [
    `session=${token}`,
    "HttpOnly",
    "SameSite=Strict",
    "Path=/",
    `Max-Age=${maxAge}`,
  ];

  if (process.env.NODE_ENV === "production") {
    secureParts.splice(2, 0, "Secure");
  }

  return secureParts.join("; ");
}

export function deleteCookie(): string {
  return "session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0";
}

export function getTokenExpiration(token: string): Date | null {
  const decoded = decodeToken(token);

  if (!decoded || !decoded.exp) {
    return null;
  }

  // JWT exp is in seconds, JavaScript Date uses miliseconds
  return new Date(decoded.exp * 1000);
}

export function isTokenExpiringSoon(
  token: string,
  hoursBeforeExpiry: number = 24
): boolean {
  const expirationDate = getTokenExpiration(token);

  if (!expirationDate) {
    return true; // Invalid token, treat as expiring
  }

  const hoursUntilExpiry =
    (expirationDate.getTime() - Date.now()) / (1000 * 60 * 60);

  return hoursUntilExpiry <= hoursBeforeExpiry;
}
