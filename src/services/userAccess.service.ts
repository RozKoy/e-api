import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";

export class UserAccessService {
    static async create(userAccesses: Prisma.UserAccessUncheckedCreateInput) {
        return prisma.userAccess.create({ data: userAccesses });
    }

    static async getOneByUserIdAndAreaIdAndFractionId(userId: string, areaId: string, fractionId: string, id?: string) {
        return prisma.userAccess.findFirst({ where: { userId, areaId, fractionId, NOT: { id } } });
    }

    static async getByUserId(userId: string) {
        return prisma.userAccess.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, });
    }

    static async getAll(search?: string, page?: number, limit?: number) {
        if (!page) {
            const userAccesses = await prisma.userAccess.findMany({
                where: search
                    ? {
                        OR: [
                            { area: { name: { contains: search, mode: "insensitive" } } },
                            { fraction: { name: { contains: search, mode: "insensitive" } } },
                        ],
                    }
                    : undefined,
                select: {
                    id: true,
                    area: true,
                    fraction: true,
                    user: true,
                    public: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: "desc" },
            });
            return {
                data: userAccesses,
                totalData: userAccesses.length,
                totalPages: 1,
            };
        }

        const take = limit && !isNaN(limit) ? limit : 10;
        const skip = (page - 1) * take;

        const [userAccesses, totalData] = await Promise.all([
            prisma.userAccess.findMany({
                skip,
                take,
                where: search
                    ? {
                        OR: [
                            { area: { name: { contains: search, mode: "insensitive" } } },
                            { fraction: { name: { contains: search, mode: "insensitive" } } },
                        ],
                    }
                    : undefined,
                select: {
                    id: true,
                    area: true,
                    fraction: true,
                    user: true,
                    public: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.userAccess.count({
                where: search
                    ? {
                        OR: [
                            { area: { name: { contains: search, mode: "insensitive" } } },
                            { fraction: { name: { contains: search, mode: "insensitive" } } },
                        ],
                    }
                    : undefined,
            }),
        ]);

        const totalPages = Math.ceil(totalData / take);

        return {
            data: userAccesses,
            totalData,
            totalPages,
        };
    }

    static async getOneById(id: string) {
        return prisma.userAccess.findUnique({ where: { id } });
    }

    static async update(id: string, userAccesses: Prisma.UserAccessUncheckedUpdateInput) {
        return prisma.userAccess.update({ where: { id }, data: userAccesses });
    }

    static async delete(id: string) {
        return prisma.userAccess.delete({ where: { id } });
    }

}