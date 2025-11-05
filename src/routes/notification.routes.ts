import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';

export const notificationRouter = Router();

notificationRouter.get('/', NotificationController.getByUserId);