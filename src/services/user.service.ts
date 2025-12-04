import prisma from "@/libs/prisma";
import { PositionCategory, Prisma } from "@generated/prisma/client";

export class UserService {

    static async create(data: Prisma.UserUncheckedCreateInput) {
        return await prisma.user.create({ data });
    }

    static async getAll(search?: string, page?: number, limit?: number, roleId?: string, areaId?: string, fractionId?: string) {
        if (!page) {
            const users = await prisma.user.findMany({
                where: {
                    ...(roleId ? { roleId: roleId } : undefined),
                    ...(areaId ? { accesses: { some: { areaId: areaId } } } : undefined),
                    ...(fractionId ? { accesses: { some: { fractionId: fractionId } } } : undefined),
                    ...(search ? { OR: [{ profile: { name: { contains: search, mode: "insensitive" } } }, { email: { contains: search, mode: "insensitive" } }] } : undefined),
                },
                select: {
                    id: true,
                    email: true,
                    roleId: true,
                    role: true,
                    accesses:{
                        include: {
                            area: true,
                            fraction: true,
                        }
                    },
                    position: {
                        include: {
                            commission: true,
                        },
                    },
                    profile: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: "desc" },
            });
            return {
                data: users,
                totalData: users.length,
                totalPages: 1,
            };
        }

        const take = limit && !isNaN(limit) ? limit : 10;
        const skip = (page - 1) * take;

        const [users, totalData] = await Promise.all([
            prisma.user.findMany({
                skip,
                take,
                where: {
                    ...(roleId ? { roleId: roleId } : undefined),
                    ...(areaId ? { accesses: { some: { areaId: areaId } } } : undefined),
                    ...(fractionId ? { accesses: { some: { fractionId: fractionId } } } : undefined),
                    ...(search ? { OR: [{ profile: { name: { contains: search, mode: "insensitive" } } }, { email: { contains: search, mode: "insensitive" } }] } : undefined),
                },
                select: {
                    id: true,
                    email: true,
                    roleId: true,
                    role: true,
                    accesses:{
                        include: {
                            area: true,
                            fraction: true,
                        }
                    },
                    position: {
                        include: {
                            commission: true,
                        },
                    },
                    profile: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.user.count({
                where: {
                    email: search
                        ? { contains: search, mode: "insensitive" }
                        : undefined,
                },
            }),
        ]);

        const totalPages = Math.ceil(totalData / take);

        return {
            data: users,
            totalData,
            totalPages,
        };
    }

    static async getAllPublic(search?: string, page?: number, limit?: number, roleId?: string, areaId?: string, fractionId?: string) {
        if (!page) {
            const users = await prisma.user.findMany({
                where: {
                    accesses: { some: { public: true } },
                    ...(roleId ? { roleId: roleId } : undefined),
                    ...(areaId ? { accesses: { some: { areaId: areaId } } } : undefined),
                    ...(fractionId ? { accesses: { some: { fractionId: fractionId } } } : undefined),
                    ...(search ? { OR: [{ profile: { name: { contains: search, mode: "insensitive" } } }, { email: { contains: search, mode: "insensitive" } }] } : undefined),
                },
                select: {
                    id: true,
                    email: true,
                    roleId: true,
                    role: true,
                    accesses:{
                        include: {
                            area: true,
                            fraction: true,
                        }
                    },
                    position: {
                        include: {
                            commission: true,
                        },
                    },
                    profile: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: "desc" },
            });
            return {
                data: users,
                totalData: users.length,
                totalPages: 1,
            };
        }

        const take = limit && !isNaN(limit) ? limit : 10;
        const skip = (page - 1) * take;

        const [users, totalData] = await Promise.all([
            prisma.user.findMany({
                skip,
                take,
                where: {
                    accesses: { some: { public: true } },
                    ...(roleId ? { roleId: roleId } : undefined),
                    ...(areaId ? { accesses: { some: { areaId: areaId } } } : undefined),
                    ...(fractionId ? { accesses: { some: { fractionId: fractionId } } } : undefined),
                    ...(search ? { OR: [{ profile: { name: { contains: search, mode: "insensitive" } } }, { email: { contains: search, mode: "insensitive" } }] } : undefined),
                },
                select: {
                    id: true,
                    email: true,
                    roleId: true,
                    role: true,
                    accesses:{
                        include: {
                            area: true,
                            fraction: true,
                        }
                    },
                    position: {
                        include: {
                            commission: true,
                        },
                    },
                    profile: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.user.count({
                where: {
                    accesses: { some: { public: true } },
                    ...(roleId ? { roleId: roleId } : undefined),
                    ...(areaId ? { accesses: { some: { areaId: areaId } } } : undefined),
                    ...(fractionId ? { accesses: { some: { fractionId: fractionId } } } : undefined),
                    ...(search ? { OR: [{ profile: { name: { contains: search, mode: "insensitive" } } }, { email: { contains: search, mode: "insensitive" } }] } : undefined),
                },
            }),
        ]);

        const totalPages = Math.ceil(totalData / take);

        return {
            data: users,
            totalData,
            totalPages,
        };
    }

    static async getOneById(id: string) {
        return await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, roleId: true, profile: true, role: true, accesses: { include: { area: true, fraction: true } }, position: { include: { commission: true } }, createdAt: true, updatedAt: true } });
    }

    static async update(id: string, data: Prisma.UserUncheckedUpdateInput) {
        return await prisma.user.update({ where: { id }, data });
    }

    static async getOneByEmail(email: string, id?: string) {
        return await prisma.user.findFirst({
            where: { email, NOT: { id }, },
            include: { role: true, accesses: true, profile: true },
        });
    }

    static async delete(id: string) {
        return await prisma.user.delete({ where: { id } });
    }

    static async getStructural(){

        const [leaders, commissions] = await Promise.all([
            prisma.user.findMany({
                where: {
                    position: {
                        category: PositionCategory.pimpinan
                    },
                },
                select: {
                    id: true,
                    email: true,
                    roleId: true,
                    profile: true,
                    accesses: {
                        include: {
                            area: true,
                            fraction: true,
                        }
                    },
                    position: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),

            prisma.user.findMany({
                where: {
                    position: {
                        category: PositionCategory.komisi
                    },
                },
                select: {
                    id: true,
                    email: true,
                    roleId: true,
                    profile: true,
                    accesses: {
                        include: {
                            area: true,
                            fraction: true,
                        }
                    },
                    position: {
                        include: {
                            commission: true
                        }
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            }),
        ])

        return {
            leaders,
            commissions,
            total: leaders.length + commissions.length
        }
    }
}