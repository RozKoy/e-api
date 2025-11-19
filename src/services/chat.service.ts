import prisma from "@/libs/prisma";
import { Prisma } from "@generated/prisma/client";

export class ChatService {
    static async createChatRoom(data: Prisma.ChatRoomUncheckedCreateInput) {
        return await prisma.chatRoom.create({ data });
    }

    static async getChatRoomByUserAIdAndUserBId(userAId: string, userBId: string) {
        return await prisma.chatRoom.findFirst({
            where: {
                OR: [
                    { userAId: userAId, userBId: userBId },
                    { userAId: userBId, userBId: userAId },
                ],
            }
        });
    }

    static async getRoomById(roomId: string) {
        return await prisma.chatRoom.findUnique({ where: { id: roomId } });
    }

    static async getRoomByUserId(userId: string) {
        return await prisma.chatRoom.findMany({
            where: {
                OR: [{ userAId: userId }, { userBId: userId }],
            },
            include: {
                userA: { select: { id: true, profile: true, email: true } },
                userB: { select: { id: true, profile: true, email: true } },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
            orderBy: { updatedAt: "desc" },
        });
    }

    static async updateChatRoom(id: string, data: Prisma.ChatRoomUncheckedUpdateInput) {
        return await prisma.chatRoom.update({ where: { id }, data });
    }

    static async getMessagesByRoomId(roomId: string) {
        return await prisma.chatMessage.findMany({
            where: { roomId },
            orderBy: { createdAt: "asc" },
            include: {
                sender: { select: { id: true, email: true, profile: true } },
            },
        });
    }

    static async createMessage(data: Prisma.ChatMessageUncheckedCreateInput) {
        return await prisma.chatMessage.create({
            data,
            include: {
                sender: { select: { id: true, email: true, profile: true } },
            },
        });
    }

    static async getMessageById(id: string) {
        return await prisma.chatMessage.findUnique({ where: { id } });
    }

    static async deleteMessageById(id: string) {
        return await prisma.chatMessage.delete({ where: { id } });
    }
}