import { Request, Response } from 'express';
import CommentModel from '../db/models/commentmodel';
import { AuthRequest } from '../middleware/authMiddleware';
import UserModel from '../db/models/usermodel';
import sequelize from 'sequelize';
import PostModel from '../db/models/postmodel';

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { content } = req.body;

        // Ensure that the user is authenticated and user object exists in the request
        if (!req.user ||!req.user.id) {
            res.status(401).json({ message: "User not authenticated" });
        }

        const userId = req.user.id;
        const postId = req.params.postId;

        // Create the comment in the database
        const comment = await CommentModel.create({
            content,
            userId,
            postId,
        });

        // Respond with the newly created comment
        res.status(201).json({
            status:'success',
            message: 'Comment created successfully',
            data: comment,
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error creating comment',
            error: error.message || error.errors,
        });
    }
}

export const getTopUsersWithLatestComments = async (req: Request, res: Response): Promise<void> => {
    try {
        // Step 1: Retrieve the latest comments from the database (limit to the most recent 10 comments)
        const latestComments = await CommentModel.findAll({
            order: [['createdAt', 'DESC']],
            limit: 3,
        });

        // Step 2: Group comments by userId
        const groupedComments = latestComments.reduce((acc, comment) => {
            const userId = comment.userId.toString();
            if (!acc[userId]) {
                acc[userId] = [];
            }
            acc[userId].push(comment);
            return acc;
        }, {} as { [userId: string]: CommentModel[] });

        // Step 3: Retrieve user information for each user with comments
        const userIds = Object.keys(groupedComments);
        const users = await UserModel.findAll({
            where: { id: userIds },
            attributes: ['id', 'firstName', 'lastName', 'country', 'email'], // Select only necessary attributes
        });

        // Step 4: Construct an array of user comments
        const userComments = users.map((user) => {
            const latestCommentsForUser = groupedComments[user.id.toString()] || [];
            return {
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                country: user.country,
                email: user.email,
                latestComments: latestCommentsForUser,
                createdAt: latestCommentsForUser[0]?.createdAt, // Get the createdAt of the latest comment
            };
        });

        // Step 5: Sort users by the creation date of their latest comment
        userComments.sort((a, b) => {
            return (b.createdAt || new Date(0)).getTime() - (a.createdAt || new Date(0)).getTime();
        });

        // Step 6: Respond with the sorted user comments
        res.status(200).json({
            status: 'success',
            message: 'Top users with latest comments retrieved successfully',
            data: userComments,
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error retrieving top users with latest comments',
            error: error.message || error.errors,
        });
    }
}