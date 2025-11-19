import prisma from "@/libs/prisma";
import { Prisma } from "@generated/prisma/client";

export class NewsService {
    static async create(data: Prisma.NewsUncheckedCreateInput) {
        return await prisma.news.create({ data });
    }

    static async getOneByTitle(title: string) {
        return await prisma.news.findFirst({ where: { title } });
    }

    static async update(id: string, data: Prisma.NewsUncheckedUpdateInput) {
        return await prisma.news.update({ where: { id }, data });
    }

    static async getAll(categoryId?: string, search?: string, page?: number, limit?: number) {
        if (!page) {
            const news = await prisma.news.findMany({
                where: {
                    ...(categoryId ? { categoryId } : undefined),
                    ...(search ? { title: { contains: search, mode: "insensitive" } } : undefined),
                },
                include: {
                    category: true
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return {
                data: news,
                totalData: news.length,
                totalPages: 1,
            };
        }

        // Jika pakai pagination
        const take = limit && !isNaN(limit) ? limit : 10;
        const skip = (page - 1) * take;

        const [news, totalData] = await Promise.all([
            prisma.news.findMany({
                skip,
                take,
                where: {
                    ...(categoryId ? { categoryId } : undefined),
                    ...(search ? { title: { contains: search, mode: "insensitive" } } : undefined),
                },
                include: {
                    category: true
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.news.count({
                where: {
                    ...(categoryId ? { categoryId } : undefined),
                    ...(search ? { title: { contains: search, mode: "insensitive" } } : undefined),
                },
            }),
        ]);

        const totalPages = Math.ceil(totalData / take);

        return {
            data: news,
            totalData,
            totalPages,
        };
    }

    static async getOne(id: string) {
        return await prisma.news.findUnique({ where: { id }, include: { category: true } });
    }

    static async delete(id: string) {
        return await prisma.news.delete({ where: { id } });
    }

}