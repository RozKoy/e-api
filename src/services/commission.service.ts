import prisma  from "@/libs/prisma";
import { Prisma } from "@generated/prisma/client";

export class CommissionService {
    static async create(data: Prisma.CommissionUncheckedCreateInput) {
        return await prisma.commission.create({ data });
    }

    static async getAll(search?: string, page?: number, limit?: number) {
        if (!page) {
            const commissions = await prisma.commission.findMany({
                where: {
                    name: search
                        ? { contains: search, mode: "insensitive" }
                        : undefined,
                },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: "desc" },
            });
            return {
                data: commissions,
                totalData: commissions.length,
                totalPages: 1,
            };
        }

        const take = limit && !isNaN(limit) ? limit : 10;
        const skip = (page - 1) * take;

        const [commissions, totalData] = await Promise.all([
            prisma.commission.findMany({
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
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.commission.count({
                where: {
                    name: search
                        ? { contains: search, mode: "insensitive" }
                        : undefined,
                },
            }),
        ]);

        const totalPages = Math.ceil(totalData / take);

        return {
            data: commissions,
            totalData,
            totalPages,
        };
    }

    static async getOneById(id: string) {
        return await prisma.commission.findUnique({ where: { id } });
    }

    static async getOneByName(name: string, id?: string) {
        return await prisma.commission.findFirst({ where: { name , NOT: { id } } });
    }

    static async update(id: string, data: Prisma.CommissionUpdateInput) {
        return await prisma.commission.update({ where: { id }, data });
    }

    static async delete(id: string) {
        return await prisma.commission.delete({ where: { id } });
    }
}