import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { createPost, getAllPosts, getPostById, getUserPosts } from '../controller/post.controller';

const postRouter = Router();
/**
   * @swagger
   * tags:
   *   name: Posts
   *   description: API endpoints to manage posts
*/

postRouter.post('/create/:userId', authMiddleware, createPost)
postRouter.get('/users/:userId', authMiddleware, getUserPosts)
postRouter.get('/:id', authMiddleware, getPostById)
postRouter.get('/', authMiddleware, getAllPosts)

export default postRouter;