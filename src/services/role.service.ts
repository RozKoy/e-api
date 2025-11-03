import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";

export class RoleService {
    static async create(data: Prisma.RoleUncheckedCreateInput) {
        return await prisma.role.create({ data });
    }

    static async getAll(search?: string, page?: number, limit?: number) {
        if (!page) {
            const roles = await prisma.role.findMany({
                where: {
                    name: search
                        ? { contains: search, mode: "insensitive" }
                        : undefined,
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return {
                data: roles,
                totalData: roles.length,
                totalPages: 1,
            };
        }

        const take = limit ?? 10;
        const skip = (page - 1) * take;

        const [roles, totalData] = await Promise.all([
            prisma.role.findMany({
                skip,
                take,
                where: {
                    name: search
                        ? { contains: search, mode: "insensitive" }
                        : undefined,
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.role.count({
                where: {
                    name: search
                        ? { contains: search, mode: "insensitive" }
                        : undefined,
                },
            }),
        ]);

        const totalPages = Math.ceil(totalData / take);

        return {
            data: roles,
            totalData,
            totalPages,
        };
    }

    static async getOneById(id: string) {
        return await prisma.role.findUnique({ where: { id } });
    }

    static async getOneByName(name: string, id?: string) {
        return await prisma.role.findUnique({ where: { name, NOT: { id } } });
    }

    static async update(id: string, data: Prisma.RoleUncheckedUpdateInput) {
        return await prisma.role.update({ where: { id }, data });
    }

    static async delete(id: string) {
        return await prisma.role.delete({ where: { id } });
    }
}