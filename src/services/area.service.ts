import prisma  from "@/libs/prisma";
import { Prisma } from "@generated/prisma/client";

export class AreaService {
    static async create(data: Prisma.AreaUncheckedCreateInput) {
        return await prisma.area.create({ data });
    }

    static async getOneById(id: string) {
        return await prisma.area.findUnique({ where: { id } });
    }

    static async getOneByName(name: string, id?: string) {
        return await prisma.area.findUnique({ where: { name, NOT: { id } } });
    }

    static async getAll(search?: string, page?: number, limit?: number) {
        if (!page) {
            const areas = await prisma.area.findMany({
                where: {
                    name: search
                        ? { contains: search, mode: "insensitive" }
                        : undefined,
                },
                select: {
                    id: true,
                    name: true,
                    code: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: "desc" },
            });
            return {
                data: areas,
                totalData: areas.length,
                totalPages: 1,
            };
        }

        const take = limit && !isNaN(limit) ? limit : 10;
        const skip = (page - 1) * take;

        const [areas, totalData] = await Promise.all([
            prisma.area.findMany({
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
                    code: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.area.count({
                where: {
                    name: search
                        ? { contains: search, mode: "insensitive" }
                        : undefined,
                },
            }),
        ]);

        const totalPages = Math.ceil(totalData / take);

        return {
            data: areas,
            totalData,
            totalPages,
        };
    }

    static async update(id: string, data: Prisma.AreaUpdateInput) {
        return await prisma.area.update({ where: { id }, data });
    }

    static async delete(id: string) {
        return await prisma.area.delete({ where: { id } });
    }
}