import request from 'supertest';
import app from '../src/index'; // Ensure this is the correct path to your index.ts
import sequelize from '../src/db/sequelize'; // Sequelize instance
import UserModel from '../src/db/models/usermodel'; // Ensure correct path to user model
import PostModel from '../src/db/models/postmodel'; // Ensure correct path to post model
import CommentModel from '../src/db/models/commentmodel';
import { generateToken } from '../src/utils/helpers';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating UUIDs

jest.mock('../src/db/models/usermodel');
jest.mock('../src/db/models/postmodel');
jest.mock('../src/db/models/commentmodel');
jest.mock('bcryptjs');
jest.mock('../src/utils/helpers');

// Mock environment variables for JWT secret key
process.env.JWT_SECRET_KEY = 'testsecretkey';

beforeEach(async () => {
    (UserModel.findAll as jest.Mock).mockReset();
    (PostModel.create as jest.Mock).mockReset();
    (CommentModel.create as jest.Mock).mockResolvedValue(mockComment);
    (generateToken as jest.Mock).mockReset();

    // Seed the database with a mock user
    await UserModel.create(mockUserData);
    await PostModel.destroy({ where: {} });
    
    // Mock the findAll method to return the mock user
    (UserModel.findAll as jest.Mock).mockResolvedValue([mockUser]);
    (PostModel.findByPk as jest.Mock).mockResolvedValue(mockPost);
    (CommentModel.findOne as jest.Mock).mockResolvedValue(mockLatestComment);
});

afterAll(async () => {
    await sequelize.close();
});

const userId = uuidv4(); 

const mockUserData = {
    id: userId,
    firstName: 'John',
    lastName: 'Doe',
    country: 'USA',
    email: 'johndoe@example.com',
    password: 'password123',
};

// const mockPost = { id: uuidv4(), title: 'First Post', content: 'Content of the first post', userId };
// const postId = mockPost.id;

const mockUser = {
    ...mockUserData,
    save: jest.fn().mockResolvedValue(mockUserData),
};

const mockPost = { id: uuidv4(), title: 'First Post', content: 'Content of the first post', userId };
const postId = mockPost.id;

const token = jwt.sign({ id: mockUserData.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' });

const mockComment = {
    id: uuidv4(),
    content: 'This is a test comment',
    userId,
    postId,
};

const mockLatestComment = {
    content: 'This is a test comment.',
};

const mockLatestPost = {
    id: mockPost.id,
    title: mockPost.title,
    content: mockPost.content,
    userId: mockPost.userId,
    createdAt: new Date(),
    updatedAt: new Date(),
}

describe('User Related Routes Test', () => {
    // Test cases for user registration
    describe('POST /v1/auth/signup', () => {
        it('should register a new user', async () => {
            (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/v1/auth/signup')
                .send(mockUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'User registered successfully');
            expect(response.body).toHaveProperty('data');
        });
    });

    // Test cases for user login
    describe('POST /v1/auth/login', () => {
        it('should return 400 for invalid input', async () => {
            const invalidData = { email: 'invalidemail', password: '' }; // Invalid data

            const response = await request(app)
                .post('/v1/auth/login')
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid input');
            expect(response.body).toHaveProperty('errors'); // Validation errors
        });

        it('should return 400 if user is not found', async () => {
            (UserModel.findOne as jest.Mock).mockResolvedValue(null); // Simulate no user found

            const response = await request(app)
                .post('/v1/auth/login')
                .send({ email: 'johndoe@example.com', password: 'password123' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid email or password');
        });

        it('should return 400 if password is incorrect', async () => {
            (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser); // User found
            (bcryptjs.compare as jest.Mock).mockResolvedValue(false); // Incorrect password

            const response = await request(app)
                .post('/v1/auth/login')
                .send({ email: 'johndoe@example.com', password: 'wrongpassword' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid email or password');
        });

        it('should login successfully and return token', async () => {
            (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser); // User found
            (bcryptjs.compare as jest.Mock).mockResolvedValue(true); // Correct password
            (generateToken as jest.Mock).mockReturnValue('mockedToken'); // Mock token generation

            const response = await request(app)
                .post('/v1/auth/login')
                .send({ email: 'johndoe@example.com', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'User logged in successfully');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('token', 'mockedToken');
            expect(response.body.data.user).toMatchObject({
                firstName: mockUser.firstName,
                lastName: mockUser.lastName,
                country: mockUser.country,
                email: mockUser.email,
            });
        });
    });

    // Test cases for retrieving all users
    describe('POST /v1/auth/', () => {
        it('should retrieve all users successfully', async () => {
            (UserModel.findAll as jest.Mock).mockResolvedValue([mockUser]);

            const response = await request(app)
                .get('/v1/auth/') // Replace with actual endpoint
                .send();

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'All users retrieved successfully');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toEqual([mockUserData]);
        });

        it('should return an empty array when no users are found', async () => {
            (UserModel.findAll as jest.Mock).mockResolvedValue([]);

            const response = await request(app)
                .get('/v1/auth') // Replace with actual endpoint for retrieving users
                .send();

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'All users retrieved successfully');
            expect(response.body.data).toEqual([]); // Ensure it returns an empty array
        });
    });

    // Test cases for retrieving user by id
    describe('GET /v1/auth/:id', () => {
        it('should retrieve a user by id successfully', async () => {
            (UserModel.findByPk as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .get('/v1/auth/123') // Replace with actual endpoint for retrieving a user by id
                .send();

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'User retrieved successfully');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject({
                firstName: mockUser.firstName,
                lastName: mockUser.lastName,
                country: mockUser.country,
                email: mockUser.email,
            });
        });

        it('should return 404 if user is not found', async () => {
            (UserModel.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .get('/v1/auth/123') // Replace with actual endpoint for retrieving a user by id
                .send();

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'User not found');
        });
    });
})

describe('POST RELATED ROUTES', () => {
    describe(`POST /v1/post/create/${userId}`, () => {
        it('should create a new post for the authenticated user successfully', async () => {
            const postData = {
                title: 'New Post',
                content: 'This is a new post content',
            };
    
            // Mock the user data
            (UserModel.findByPk as jest.Mock).mockResolvedValue(mockUser);
    
            // Mock creating the post
            (PostModel.create as jest.Mock).mockResolvedValue({
                id: uuidv4(),
                title: postData.title,
                content: postData.content,
                userId: mockUser.id,
            });
    
            const response = await request(app)
                .post(`/v1/post/create/${mockUser.id}`)
                .send(postData)
                .set('Authorization', `Bearer ${token}`);
    
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'Post created successfully');
            expect(response.body).toHaveProperty('data');
        });
    
        it('should return 401 if user is not authenticated', async () => {
            const postData = {
                title: 'Unauthorized Post',
                content: 'This should fail due to no token',
            };
    
            const response = await request(app)
                .post(`/v1/post/create/${userId}`) // No token provided
                .send(postData);
    
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Token is required');
        });
    
        it('should return 500 if there is an error creating the post', async () => {
            const postData = {
                title: 'New Post',
                content: 'This is a new post content',
            };
    
            // Simulate an error when trying to create the post
            (PostModel.create as jest.Mock).mockRejectedValue(new Error('Database error'));
    
            const response = await request(app)
                .post(`/v1/post/create/${mockUser.id}`)
                .send(postData)
                .set('Authorization', `Bearer ${token}`);
    
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Error creating post');
            expect(response.body).toHaveProperty('error', 'Database error');
        });
    });
    
    describe(`GET /v1/post/users/${userId}`, () => {
        const mockPosts = [
            { id: uuidv4(), title: 'First Post', content: 'Content of the first post', userId },
            { id: uuidv4(), title: 'Second Post', content: 'Content of the second post', userId }
        ];
    
        it('should retrieve posts for the specified user', async () => {
            (PostModel.findAll as jest.Mock).mockResolvedValue(mockPosts);
    
            const response = await request(app)
                .get(`/v1/post/users/${mockUser.id}/`)
                .set('Authorization', `Bearer ${token}`);
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'Posts retrieved successfully');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toEqual(mockPosts);
        });
    
        it('should return 404 if no posts are found for the user', async () => {
            (PostModel.findAll as jest.Mock).mockResolvedValue(null);
    
            const response = await request(app)
                .get(`/v1/post/users/${mockUser.id}`)
                .set('Authorization', `Bearer ${token}`);
    
            expect(response.status).toBe(404); 
            expect(response.body).toHaveProperty('message', 'No posts found for this user');
        });
    
        it('should return 500 if an error occurs during retrieval', async () => {
            (PostModel.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));
    
            const response = await request(app)
                .get(`/v1/post/users/${mockUser.id}`)
                .set('Authorization', `Bearer ${token}`);
    
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Error retrieving posts');
            expect(response.body).toHaveProperty('error', 'Database error');
        });
    });
})

describe('COMMENT RELATED ROUTES', () => {
    describe('POST /v1/comment/create/:postId', () => {
        it('should create a comment successfully', async () => {
            const response = await request(app)
                .post(`/v1/comment/create/${postId}`)
                .set('Authorization', `Bearer ${token}`) // Setting Authorization header
                .send({ content: 'This is a test comment' }); // Sending comment content
    
            // Expect success response with status 201
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'Comment created successfully');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toEqual(mockComment); // Ensure response matches the mock comment
        });
    
        it('should return 401 if user is not authenticated', async () => {
            const response = await request(app)
                .post(`/v1/comment/create/${postId}`)
                .send({ content: 'This is a test comment' }); // No Authorization header
    
            // Expect unauthorized response with status 401
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Token is required');
        });
    
        it('should return 500 if an error occurs during comment creation', async () => {
            // Mock CommentModel.create to throw an error
            (CommentModel.create as jest.Mock).mockRejectedValue(new Error('Database error'));
    
            const response = await request(app)
                .post(`/v1/comment/create/${postId}`)
                .set('Authorization', `Bearer ${token}`) // Valid auth header
                .send({ content: 'This is a test comment' });
    
            // Expect internal server error with status 500
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Error creating comment');
            expect(response.body).toHaveProperty('error', 'Database error');
        });
    });

    describe('GET /v1/comment/get-latest-comments', () => {
        it('should retrieve top users with their latest comments successfully', async () => {
        
            // Mock the database response to return the expected data
            (UserModel.findAll as jest.Mock).mockResolvedValue([mockUserData]);
        
            // Perform the request to retrieve top users with latest comments
            const response = await request(app)
                .get('/v1/comment/get-latest-comments')
                .set('Authorization', `Bearer ${token}`);
        
            // Assertions for the response structure and content
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'Top users with latest comments retrieved successfully');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toEqual([
                {
                    userId: mockUserData.id,
                    firstName: mockUserData.firstName,
                    lastName: mockUserData.lastName,
                    country: mockUserData.country,
                    email: mockUserData.email,
                    latestPostTitle: mockLatestPost.title,
                    latestComment: mockLatestComment.content
                }
            ]); // Ensure response matches the mock data
        });

        it('should return 401 if user is not authenticated', async () => {
            const response = await request(app)
                .get('/v1/comment/get-latest-comments'); 
                // No Authorization header
    
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Token is required');
        });

        it('should return 500 if an error occurs during retrieval', async () => {
            // Mock UserModel.findAll to throw an error
            (UserModel.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));
        
            const response = await request(app)
                .get('/v1/comment/get-latest-comments')
                .set('Authorization', `Bearer ${token}`); 
        
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Error retrieving top users with latest comments');
            expect(response.body).toHaveProperty('error', 'Database error');
        });
    });
})