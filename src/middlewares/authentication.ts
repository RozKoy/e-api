import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/types/authenticatedRequest";
import jwt from "jsonwebtoken";
import { UserService } from "@/services/user.service";

export const authentication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: Token tidak ditemukan",
      });
    }

    const token = authHeader.split(" ")[1];

    const secret = process.env.JWT_ACCESS_SECRET as string;
    if (!secret) {
      throw new Error("Unauthorized: Token tidak valid");
    }

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: Token tidak valid",
      });
    }

    const userExist = await UserService.getOneById(decoded.userId);

    if (!userExist) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: User tidak valid",
      });
    }

    req.payload = {
      userId: decoded.userId,
      roleId: decoded.roleId,
    };

    next();
  } catch (error: any) {
    console.error(error);
    return res.status(401).json({
      status: "error",
      message: "Unauthorized: Token tidak valid",
    });
  }
};
