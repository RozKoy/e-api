import { ChatService } from '@/services/chat.service';
import { UserService } from '@/services/user.service';
import { AuthenticatedRequest } from '@/types/authenticatedRequest';
import { Response } from 'express';
import Validator from 'fastest-validator';

export class ChatController {

    static async createOrGetChatRoom(req: AuthenticatedRequest, res: Response) {

        const { userId } = req.payload!;

        const { otherUserId } = req.params;

        const v = new Validator();

        const schema = {
            otherUserId: { type: "string", empty: false }
        };

        try {

            const check = v.compile(schema);

            const validationResponse = check({ otherUserId });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const otherUserExist = await UserService.getOneById(otherUserId);

            if (!otherUserExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User tujuan tidak ditemukan'
                });
            }

            const chatRoomExist = await ChatService.getChatRoomByUserAIdAndUserBId(userId, otherUserId);

            if (chatRoomExist) {

                return res.status(200).json({
                    status: 'success',
                    message: 'Berhasil mendapatkan ruang chat',
                    data: chatRoomExist
                });

            }

            const chatRoom = await ChatService.createChatRoom({ userAId: userId, userBId: otherUserId });

            return res.status(201).json({
                status: 'success',
                message: 'Berhasil menambahkan ruang chat',
                data: chatRoom
            });


        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal menambahkan ruang chat'
            });
        }
    }

    static async getRoomByUserId(req: AuthenticatedRequest, res: Response) {

        const { userId } = req.payload!;

        try {

            const chatRooms = await ChatService.getRoomByUserId(userId);

            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mendapatkan ruang chat',
                data: chatRooms
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mendapatkan ruang chat'
            });
        }
    }

    static async getChatRoomMessages(req: AuthenticatedRequest, res: Response) {

        const { roomId } = req.params;

        const { userId } = req.payload!;

        try {

            const roomExist = await ChatService.getRoomById(roomId);

            if (!roomExist) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Ruang chat tidak ditemukan'
                });
            }

            if (roomExist.userAId !== userId && roomExist.userBId !== userId) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Anda tidak memiliki akses ke ruang chat ini'
                });
            }

            const messages = await ChatService.getMessagesByRoomId(roomId);

            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mendapatkan pesan',
                data: messages
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mendapatkan pesan'
            });
        }
    }

    static async createMessage(req: AuthenticatedRequest, res: Response) {

        const { roomId } = req.params;

        const { userId } = req.payload!;

        const { message } = req.body;

        const v = new Validator();

        const schema = {
            message: { type: "string", empty: false }
        };

        try {

            const check = v.compile(schema);

            const validationResponse = check({ message });

            if (validationResponse !== true) {
                return res.status(400).json({
                    status: 'error',
                    message: validationResponse
                });
            }

            const roomExist = await ChatService.getRoomById(roomId);

            if (!roomExist) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Ruang chat tidak ditemukan'
                });
            }

            if (roomExist.userAId !== userId && roomExist.userBId !== userId) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Anda tidak memiliki akses ke ruang chat ini'
                });
            }

            const chatMessage = await ChatService.createMessage({ roomId, senderId: userId, message });

            await ChatService.updateChatRoom(roomId, { updatedAt: new Date() });

            return res.status(201).json({
                status: 'success',
                message: 'Berhasil mengirim pesan',
                data: chatMessage
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mengirim pesan'
            });
        }
    }

    static async deleteMessage(req: AuthenticatedRequest, res: Response) {

        const { messageId } = req.params;

        const { userId } = req.payload!;

        try {

            const messageExist = await ChatService.getMessageById(messageId);

            if (!messageExist) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Pesan tidak ditemukan'
                });
            }

            if (messageExist.senderId !== userId) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Anda tidak memiliki akses untuk menghapus pesan ini'
                });
            }

            if (messageExist.createdAt < new Date(Date.now() - 1 * 60 * 60 * 1000)) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Anda tidak memiliki akses untuk menghapus pesan ini'
                });
            }

            await ChatService.deleteMessageById(messageId);

            return res.status(200).json({
                status: 'success',
                message: 'Berhasil menghapus pesan'
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal menghapus pesan'
            });
        }
    }
}