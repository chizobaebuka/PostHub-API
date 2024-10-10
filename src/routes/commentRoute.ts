import { Router } from 'express';
import { createComment, getTopUsersWithLatestComments } from '../controller/comment.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const commentRoute = Router();

// Import the controllers
commentRoute.post('/create/:postId', authMiddleware, createComment)
commentRoute.get('/get-latest-comments', authMiddleware, getTopUsersWithLatestComments)

export default commentRoute;