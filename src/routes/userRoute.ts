import { Router } from 'express';
import { getAllUsers, getUserById, loginUser, registerUser } from '../controller/user.controller';
import { createPost, getUserPosts } from '../controller/post.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const userRouter = Router();

userRouter.post('/signup', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/:id/posts', authMiddleware, createPost)
userRouter.get('/:id/posts', authMiddleware, getUserPosts)

export default userRouter;