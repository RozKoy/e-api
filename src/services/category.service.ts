import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";

export class CategoryService {
    static async create(data: Prisma.CategoryUncheckedCreateInput) {
        return await prisma.category.create({ data });
    }

    static async getOneByName(name: string, id?: string) {
        return await prisma.category.findFirst({ where: { name, NOT: { id } } });
    }

    static async getAll(search?: string, page?: number, limit?: number) {
        if (!page) {
            const categories = await prisma.category.findMany({
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
            });
            return {
                data: categories,
                totalData: categories.length,
                totalPages: 1,
            };
        }

        const take = limit && !isNaN(limit) ? limit : 10;
        const skip = (page - 1) * take;

        const [categories, totalData] = await Promise.all([
            prisma.category.findMany({
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
            }),
            prisma.category.count({
                where: {
                    name: search
                        ? { contains: search, mode: "insensitive" }
                        : undefined,
                },
            }),
        ]);

        const totalPages = Math.ceil(totalData / take);

        return {
            data: categories,
            totalData,
            totalPages,
        };
    }

    static async getOneById(id: string) {
        return await prisma.category.findUnique({ where: { id }, select: { id: true, name: true, createdAt: true, updatedAt: true } });
    }

    static async update(id: string, data: Prisma.CategoryUncheckedUpdateInput) {
        return await prisma.category.update({ where: { id }, data });
    }

    static async delete(id: string) {
        return await prisma.category.delete({ where: { id } });
    }
}