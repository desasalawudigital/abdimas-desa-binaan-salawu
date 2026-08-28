import { SignJWT, jwtVerify } from "jose";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    console.warn("JWT_SECRET is not set in environment variables. Using a fallback secret (Not secure for production!)");
    return "super_secret_fallback_key_for_abdimas_salawu";
  }
  return secret;
};

export const verifyToken = async (token: string) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    );
    return verified.payload;
  } catch {
    // Token is invalid or expired
    return null;
  }
};

export const signToken = async (payload: Record<string, unknown>) => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Expire in 24 hours
    .sign(new TextEncoder().encode(getJwtSecretKey()));
  return token;
};
