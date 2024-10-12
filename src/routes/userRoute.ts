import { Router } from 'express';
import { getAllUsers, getUserById, loginUser, registerUser } from '../controller/user.controller';
import { createPost, getPostById, getUserPosts } from '../controller/post.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const userRouter = Router();

/**
   * @swagger
   * tags:
   *   name: Users
   *   description: API endpoints to manage users
*/

userRouter.post('/signup', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);

export default userRouter;