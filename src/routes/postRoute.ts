import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getPostById } from '../controller/post.controller';

const postRouter = Router();

postRouter.get('/:id', authMiddleware, getPostById)

export default postRouter;