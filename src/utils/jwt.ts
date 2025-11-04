import jwt from "jsonwebtoken";

export function generateAccessToken(userId: string, roleId?: string ) {
  const secret = process.env.JWT_ACCESS_SECRET as string;
  const token = jwt.sign({ userId, roleId }, secret, {
    expiresIn: "24h",
  });
  const decoded = jwt.decode(token) as jwt.JwtPayload;

  return { token, expiresIn: decoded.exp };
}

export function decodeToken(token: string) {
  try {
    const secret = process.env.JWT_ACCESS_SECRET as string;
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    return decoded.userId;
  } catch (error) {
    throw new Error("Invalid token");
  }
}
