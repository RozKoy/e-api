import prisma from "@/libs/prisma";

export class PermissionService {
    static async getAll() {
        return await prisma.permission.findMany({orderBy: { createdAt: "desc" },});
    }

    static async getOneById(id: string) {
        return await prisma.permission.findUnique({ where: { id } });
    }
}