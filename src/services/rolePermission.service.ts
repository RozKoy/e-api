import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";

export class RolePermissionService {
    static async getAll() {
        return await prisma.rolePermission.findMany();
    }

    static async getOneById(id: string) {
        return await prisma.rolePermission.findUnique({ where: { id } });
    }

    static async assign(data: Prisma.RolePermissionUncheckedCreateInput) {
        return await prisma.rolePermission.create({ data });
    }

    static async getAllByRoleId(roleId: string) {
        return await prisma.rolePermission.findMany({ where: { roleId }, include: { permission: true } });
    }

    static async deleteByRoleId(roleId: string) {
        return await prisma.rolePermission.deleteMany({ where: { roleId } });
    }

    static async delete(id: string) {
        return await prisma.rolePermission.delete({ where: { id } });
    }
}