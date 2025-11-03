import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";

export class UserService {

    static async create(data: Prisma.UserUncheckedCreateInput){
        return await prisma.user.create({ data });
    }

    static async getAll(search?: string, page?: number, limit?: number) {
        if (!page) {
            const users = await prisma.user.findMany({
                where: {
                    email: search
                        ? { contains: search, mode: "insensitive" }
                        : undefined,
                },
                select: {
                    id: true,
                    email: true,
                    roleId: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return {
                data: users,
                totalData: users.length,
                totalPages: 1,
            };
        }

        const take = limit ?? 10;
        const skip = (page - 1) * take;

        const [users, totalData] = await Promise.all([
            prisma.user.findMany({
                skip,
                take,
                where: {
                    email: search
                        ? { contains: search, mode: "insensitive" }
                        : undefined,
                },
                select: {
                    id: true,
                    email: true,
                    roleId: true,
                    createdAt: true,
                    updatedAt: true,
                },
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

    static async getOneById(id: string) {
        return await prisma.user.findUnique({ where: { id } });
    }
    
    static async update(id: string, data: Prisma.UserUncheckedUpdateInput) {
        return await prisma.user.update({ where: { id }, data });
    }

    static async getOneByEmail(email: string, id? : string) {
        return await prisma.user.findFirst({ where: { email, NOT: { id } } });
    }

    static async delete(id: string) {
        return await prisma.user.delete({ where: { id } });
    }
}