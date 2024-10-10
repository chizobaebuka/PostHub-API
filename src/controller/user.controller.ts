import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import UserModel from '../db/models/usermodel';
import { loginUserSchema, signUpUserSchema } from '../utils/validators';
import { generateToken } from '../utils/helpers';
import { AuthRequest } from '../middleware/authMiddleware';

dotenv.config();

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const validation = signUpUserSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ 
            message: 'Invalid input', 
            errors: validation.error.errors 
        });
        return;  // Ensure the function ends after sending the response
    }

    const { firstName, lastName, country, email, password } = validation.data;

    const existingUser = await UserModel.findOne({ where: { email }});
    if (existingUser) {
        res.status(400).json({ message: 'Email already exists' });
        return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await UserModel.create({
        id: uuidv4(),
        firstName,
        lastName,
        country,
        email,
        password: hashedPassword,
    });
    
    await user.save();

    const userResponse = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        email: user.email,
    };

    res.status(201).json({ 
        status: 'success', 
        message: 'User registered successfully', 
        data: userResponse 
    });
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const validation = loginUserSchema.safeParse(req.body)
    if (!validation.success) {
        res.status(400).json({ 
            message: 'Invalid input', 
            errors: validation.error.errors 
        });
        return;  // Ensure the function ends after sending the response
    }

    const { email, password } = validation.data;

    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
        res.status(400).json({ message: 'Invalid email or password' });
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(400).json({ message: 'Invalid email or password' });
        return;
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        res.status(500).json({ message: 'Internal server error: Secret key is not defined' });
        return;
    }

    // Use dynamic token generation
    const token = generateToken({ id: user.id }, secretKey, '1h');

    const userResponse = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        email: user.email,
    };

    res.status(200).json({
        status: 'success',
        message: 'User logged in successfully',
        data: { token, user: userResponse },
    });
};

export const getAllUsers = async(req: Request, res: Response): Promise<void> => {
    const users = await UserModel.findAll();

    res.status(200).json({
        status:'success',
        message: 'All users retrieved successfully',
        data: users,
    });
}

export const getUserById = async(req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await UserModel.findByPk(id);

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    res.status(200).json({
        status:'success',
        message: 'User retrieved successfully',
        data: user,
    });
}

