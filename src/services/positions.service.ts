import { Position } from './../generated/prisma/browser';
import prisma from "@/libs/prisma";
import { PosisionLevel, PositionCategory, Prisma } from "@generated/prisma/client";

export class PositionService {
    static async create(data: Prisma.PositionUncheckedCreateInput) {
        return await prisma.position.create({ data });
    }

    static async getAll(search?: string, page?: number, limit?: number, category?: PositionCategory, level?: PosisionLevel, commissionId?: string) {
        if (!page) {
            const positions = await prisma.position.findMany({
                where: {
                    ...(category ? { category } : undefined),
                    ...(level ? { level } : undefined),
                    ...(commissionId ? { commissionId } : undefined),
                    ...(search ? { name: { contains: search, mode: "insensitive" } } : undefined),
                },
                include: {
                    commission: true
                },
                orderBy: { createdAt: "desc" },
            });
            return {
                data: positions,
                totalData: positions.length,
                totalPages: 1,
            };
        }

        const take = limit && !isNaN(limit) ? limit : 10;
        const skip = (page - 1) * take;

        const [positions, totalData] = await Promise.all([
            prisma.position.findMany({
                skip,
                take,
                where: {
                    ...(category ? { category } : undefined),
                    ...(level ? { level } : undefined),
                    ...(commissionId ? { commissionId } : undefined),
                    ...(search ? { name: { contains: search, mode: "insensitive" } } : undefined),
                },
                include: {
                    commission: true
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.position.count({
                where: {
                    ...(category ? { category } : undefined),
                    ...(level ? { level } : undefined),
                    ...(commissionId ? { commissionId } : undefined),
                    ...(search ? { name: { contains: search, mode: "insensitive" } } : undefined),
                },
            }),
        ]);

        const totalPages = Math.ceil(totalData / take);

        return {
            data: positions,
            totalData,
            totalPages,
        };
    }

    static async getOneById(id: string) {
        return await prisma.position.findUnique({ where: { id } });
    }

    static async getOneByName(name: string, id?: string) {
        return await prisma.position.findFirst({ where: { name, NOT: { id } } });
    }

    static async update(id: string, data: Prisma.PositionUncheckedUpdateInput) {
        return await prisma.position.update({ where: { id }, data });
    }

    static async delete(id: string) {
        return await prisma.position.delete({ where: { id } });
    }
}