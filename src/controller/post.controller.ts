import { Request, Response } from 'express';
import PostModel from '../db/models/postmodel';
import { AuthRequest } from '../middleware/authMiddleware';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, content } = req.body;

        // Ensure that the user is authenticated and user object exists in the request
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "User not authenticated" });
        }

        const userId = req.user.id;

        // Create the post in the database
        const post = await PostModel.create({
            title,
            content,
            userId,  // Associate the post with the authenticated user
        });

        // Respond with the newly created post
        res.status(201).json({
            status: 'success',
            message: 'Post created successfully',
            data: post,
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error creating post',
            error: error.message || error.errors,
        });
    }
};

export const getPostById = async (req: Request, res: Response): Promise<void>  => {
    try {
        const postId = req.params.id
        const post = await PostModel.findOne({ where: { id: postId } })

        if (!post) {
            res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Post retrieved successfully',
            data: post,
        });
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving post', error: error.errors });
        return;
    }
}

export const getUserPosts = async (req: Request, res: Response): Promise<void>  => {
    try {
        const userId = req.params.id
        const posts = await PostModel.findAll({ where: { userId } })

        if (!posts) {
            res.status(404).json({ message: 'No posts found for this user' });
            return;  // Ensure the function ends after sending the response if no posts are found for the user
        }

        res.status(200).json({
            status: 'success',
            message: 'Posts retrieved successfully',
            data: posts,
        });
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving posts', error: error.errors });
        return;
    }
}