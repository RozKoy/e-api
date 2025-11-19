import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/types/authenticatedRequest";
import { RolePermissionService } from "@/services/rolePermission.service";

export const authorization = (PermissionName: string) => {
    return async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const roleId = req.payload?.roleId;

            if (!roleId) {
                return res.status(403).json({
                    status: "error",
                    message: "Forbidden: User tidak memiliki izin",
                });
            }

            const userRolePermission = await RolePermissionService.getAllByRoleId(roleId);

            if (!userRolePermission.some(permission => permission.permission.name === PermissionName)) {
                return res.status(403).json({
                    status: "error",
                    message: "Forbidden: User tidak memiliki izin",
                });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(403).json({
                status: "error",
                message: "Forbidden: User tidak memiliki izin",
            });
        }
    };
};
