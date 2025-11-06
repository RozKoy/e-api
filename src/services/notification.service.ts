import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";

export class NotificationService {
    static async create(data: Prisma.NotificationUncheckedCreateInput) {
        return await prisma.notification.create({ data });
    }

    static async getByUserId(userId: string) {
        return await prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    } 
}