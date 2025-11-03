import { Router } from 'express';
import { exampleRouter } from './example.route';

export const router = Router();
router.use('/example', exampleRouter);