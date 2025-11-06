import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";

export class FractionService {
    static async create(data: Prisma.FractionUncheckedCreateInput) {
        return await prisma.fraction.create({ data });
    }

    static async getOneById(id: string) {
        return await prisma.fraction.findUnique({ where: { id } });
    }

    static async getOneByName(name: string, id?: string) {
        return await prisma.fraction.findUnique({ where: { name, NOT: { id } } });
    }

    static async getAll(search?: string, page?: number, limit?: number) {
        if (!page) {
            const fractions = await prisma.fraction.findMany({
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
                data: fractions,
                totalData: fractions.length,
                totalPages: 1,
            };
        }

        const take = limit && !isNaN(limit) ? limit : 10;
        const skip = (page - 1) * take;

        const [fractions, totalData] = await Promise.all([
            prisma.fraction.findMany({
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
            prisma.fraction.count({
                where: {
                    name: search
                        ? { contains: search, mode: "insensitive" }
                        : undefined,
                },
            }),
        ]);

        const totalPages = Math.ceil(totalData / take);

        return {
            data: fractions,
            totalData,
            totalPages,
        };
    }

    static async update(id: string, data: Prisma.FractionUpdateInput) {
        return await prisma.fraction.update({ where: { id }, data });
    }

    static async delete(id: string) {
        return await prisma.fraction.delete({ where: { id } });
    }
}