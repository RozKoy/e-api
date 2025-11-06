import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';

export const chatRouter = Router();

chatRouter.get('/room/user', ChatController.getRoomByUserId);
chatRouter.get('/room/message/:roomId', ChatController.getChatRoomMessages);
chatRouter.post('/room/message/:roomId', ChatController.createMessage);
chatRouter.delete('/room/message/:messageId', ChatController.deleteMessage);
chatRouter.get('/room/:otherUserId', ChatController.createOrGetChatRoom);