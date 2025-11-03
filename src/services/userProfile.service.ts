import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";

export class UserProfileService {
    static async create(data: Prisma.UserProfileUncheckedCreateInput) {
        return await prisma.userProfile.create({ data });
    }

    static async update(id: string, data: Prisma.UserProfileUncheckedUpdateInput) {
        return await prisma.userProfile.update({ where: { id }, data });
    }

    static async getOneByUserId(userId: string) {
        return await prisma.userProfile.findUnique({ where: { userId } });
    }

    static async getOneById(id: string) {
        return await prisma.userProfile.findUnique({ where: { id } });
    }
}