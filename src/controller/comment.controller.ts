import { Request, Response } from 'express';
import CommentModel from '../db/models/commentmodel';
import { AuthRequest } from '../middleware/authMiddleware';
import UserModel from '../db/models/usermodel';
import sequelize, { Op } from 'sequelize';
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
        // Step 1: Retrieve users with their postId
        const topUsers = await UserModel.findAll({
            attributes: ['id', 'firstName', 'lastName', 'country', 'email', 'postId'], // Select necessary attributes including postId
            where: {
                postId: { [Op.ne]: null } // Ensure users have a postId associated
            },
            order: [['postId', 'DESC']], // Optionally order by postId
            limit: 10 // Limit to top 3 users
        });

        // Step 2: Construct user data and fetch the latest comments based on postId
        const responseData = await Promise.all(topUsers.map(async (user) => {
            // Fetch the latest comment for the post associated with the user
            const post = await PostModel.findByPk(user.postId || undefined);

            const latestComment = await CommentModel.findOne({
                where: { postId: user.postId },
                order: [['createdAt', 'DESC']],
            });

            console.log({ latestComment: latestComment });

            return {
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                country: user.country,
                email: user.email,
                latestPostTitle: post?.title || null, 
                latestComment: latestComment?.content || null, 
                postId: user.postId 
            };
        }));

        // Step 3: Send the response
        res.status(200).json({
            status: 'success',
            message: 'Top users with latest comments retrieved successfully',
            data: responseData,
        });
    } catch (error: any) {
        console.error('Error occurred:', error);
        res.status(500).json({
            message: 'Error retrieving top users with latest comments',
            error: error.message || error.errors,
        });
        return;
    }
};