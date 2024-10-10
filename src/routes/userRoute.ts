import { Router } from 'express';
import { getAllUsers, getUserById, loginUser, registerUser } from '../controller/user.controller';

const userRouter = Router();

userRouter.post('/signup', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);

export default userRouter;