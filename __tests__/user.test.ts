// import request from 'supertest';
// import app from '../src/index'; // Ensure this is the correct path to your index.ts
// import sequelize from '../src/db/sequelize'; // Sequelize instance
// import UserModel from '../src/db/models/usermodel'; // Ensure correct path to user model
// import { generateToken } from '../src/utils/helpers';
// import bcryptjs from 'bcryptjs';
// import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating UUIDs
// import PostModel from '../src/db/models/postmodel';

// jest.mock('../src/db/models/usermodel');
// jest.mock('../src/db/models/postmodel'); 
// jest.mock('bcryptjs');
// jest.mock('../src/utils/helpers');

// // Mock environment variables for JWT secret key
// process.env.JWT_SECRET_KEY = 'testsecretkey';

// afterAll(async () => {
//     await sequelize.close();
// })


// const mockUserData = {
//     id: uuidv4(),
//     firstName: 'John',
//     lastName: 'Doe',
//     country: 'USA',
//     email: 'johndoe@example.com',
//     password: 'password123', // Assuming you won't return this in a real response
// };

// // const id = mockUserData.id;
// // console.log({ 'id': id })
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcyN2Q0ZTQ3LTA0ZWItNGM0Ni04Yzc4LTAxZmQwNGI2NzJlNSIsImlhdCI6MTcyODY0NzM5MiwiZXhwIjoxNzI4NjUwOTkyfQ.zZx1I4ZXdFJSC_UHQ6ZH4q8pysjJR8SrVYxUIsuTqO8"

// const mockUser = {
//     ...mockUserData,
//     save: jest.fn().mockResolvedValue(mockUserData), // Keep this for other tests if needed
// };

// describe('POST /v1/auth/signup', () => {
//     it('should register a new user', async () => {
//         (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

//         const response = await request(app)
//             .post('/v1/auth/signup')
//             .send(mockUser);

//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty('status','success');
//         expect(response.body).toHaveProperty('message', 'User registered successfully');
//         expect(response.body).toHaveProperty('data');
//     })
// })

// describe('POST /v1/auth/login', () => {
//     it('should return 400 for invalid input', async () => {
//         const invalidData = { email: 'invalidemail', password: '' }; // Invalid data

//         const response = await request(app)
//             .post('/v1/auth/login')
//             .send(invalidData);

//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty('message', 'Invalid input');
//         expect(response.body).toHaveProperty('errors'); // Validation errors
//     });

//     it('should return 400 if user is not found', async () => {
//         (UserModel.findOne as jest.Mock).mockResolvedValue(null); // Simulate no user found

//         const response = await request(app)
//             .post('/v1/auth/login')
//             .send({ email: 'johndoe@example.com', password: 'password123' });

//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty('message', 'Invalid email or password');
//     });

//     it('should return 400 if password is incorrect', async () => {
//         (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser); // User found
//         (bcryptjs.compare as jest.Mock).mockResolvedValue(false); // Incorrect password

//         const response = await request(app)
//             .post('/v1/auth/login')
//             .send({ email: 'johndoe@example.com', password: 'wrongpassword' });

//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty('message', 'Invalid email or password');
//     });

//     it('should login successfully and return token', async () => {
//         (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser); // User found
//         (bcryptjs.compare as jest.Mock).mockResolvedValue(true); // Correct password
//         (generateToken as jest.Mock).mockReturnValue('mockedToken'); // Mock token generation

//         const response = await request(app)
//             .post('/v1/auth/login')
//             .send({ email: 'johndoe@example.com', password: 'password123' });

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('status', 'success');
//         expect(response.body).toHaveProperty('message', 'User logged in successfully');
//         expect(response.body).toHaveProperty('data');
//         expect(response.body.data).toHaveProperty('token', 'mockedToken');
//         expect(response.body.data.user).toMatchObject({
//             firstName: mockUser.firstName,
//             lastName: mockUser.lastName,
//             country: mockUser.country,
//             email: mockUser.email,
//         });
//     });
// })

// describe('POST /v1/auth/', () => {
//     it('should retrieve all users successfully', async () => {
//         (UserModel.findAll as jest.Mock).mockResolvedValue([mockUser]);

//         const response = await request(app)
//             .get('/v1/auth/') // Replace with actual endpoint
//             .send();

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('status', 'success');
//         expect(response.body).toHaveProperty('message', 'All users retrieved successfully');
//         expect(response.body).toHaveProperty('data');
//         expect(response.body.data).toEqual([mockUserData]);
//     });

//     it('should return an empty array when no users are found', async () => {
//         (UserModel.findAll as jest.Mock).mockResolvedValue([]);

//         const response = await request(app)
//             .get('/v1/auth') // Replace with actual endpoint for retrieving users
//             .send();

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('status', 'success');
//         expect(response.body).toHaveProperty('message', 'All users retrieved successfully');
//         expect(response.body.data).toEqual([]); // Ensure it returns an empty array
//     });
// })

// describe('GET /v1/auth/:id', () => {
//     it('should retrieve a user by id successfully', async () => {
//         (UserModel.findByPk as jest.Mock).mockResolvedValue(mockUser);

//         const response = await request(app)
//             .get('/v1/auth/123') // Replace with actual endpoint for retrieving a user by id
//             .send();

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('status', 'success');
//         expect(response.body).toHaveProperty('message', 'User retrieved successfully');
//         expect(response.body).toHaveProperty('data');
//         expect(response.body.data).toMatchObject({
//             firstName: mockUser.firstName,
//             lastName: mockUser.lastName,
//             country: mockUser.country,
//             email: mockUser.email,
//         });
//     });

//     it('should return 404 if user is not found', async () => {
//         (UserModel.findByPk as jest.Mock).mockResolvedValue(null);

//         const response = await request(app)
//             .get('/v1/auth/123') // Replace with actual endpoint for retrieving a user by id
//             .send();

//         expect(response.status).toBe(404);
//         expect(response.body).toHaveProperty('message', 'User not found');
//     });
// })

// describe(`POST /v1/auth/ab78a3a9-a7b1-4ab9-85b1-706aae055716/posts`, () => {
//     it('should create a new post for a user by id successfully', async () => {

//         // const token = generateToken(
//         //     { id },
//         //     process.env.JWT_SECRET_KEY!,
//         //     '1h'
//         // );

//         (UserModel.findByPk as jest.Mock).mockResolvedValue(mockUser);
//         // Mock PostModel.create to simulate post creation
//         (PostModel.create as jest.Mock).mockResolvedValue({
//             id: uuidv4(),
//             title: 'New Post',
//             content: 'This is a new post.',
//             userId: mockUser.id, // Associate the post with the mocked user
//         });

//         const response = await request(app)
//             .post(`/v1/auth/${mockUser.id}/posts`) // Replace with actual endpoint for creating a new post
//             .send({ title: 'New Post', content: 'This is a new post.' })
//             .set('Authorization', `Bearer ${token}`);

//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty('status', 'success');
//         expect(response.body).toHaveProperty('message', 'Post created successfully');
//         expect(response.body).toHaveProperty('data');
//         expect(response.body.data).toHaveProperty('id');
//         expect(response.body.data).toHaveProperty('userId', mockUser.id);
//         expect(response.body.data).toHaveProperty('title', 'New Post');
//     });
// })

// import { mockUser } from './mockData'; 

import request from 'supertest';
import app from '../src/index'; // Ensure this is the correct path to your index.ts
import sequelize from '../src/db/sequelize'; // Sequelize instance
import UserModel from '../src/db/models/usermodel'; // Ensure correct path to user model
import PostModel from '../src/db/models/postmodel'; // Ensure correct path to post model
import { generateToken } from '../src/utils/helpers';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating UUIDs
import { AuthRequest } from '../src/middleware/authMiddleware';
import { createPost } from '../src/controller/post.controller';

jest.mock('../src/db/models/usermodel');
jest.mock('../src/db/models/postmodel'); // Mock the post model
jest.mock('bcryptjs');
jest.mock('../src/utils/helpers');

// Mock environment variables for JWT secret key
process.env.JWT_SECRET_KEY = 'testsecretkey';


afterAll(async () => {
    await sequelize.close();
});

const mockUserData = {
    id: uuidv4(),
    firstName: 'John',
    lastName: 'Doe',
    country: 'USA',
    email: 'johndoe@example.com',
    password: 'password123', // Assuming you won't return this in a real response
};

const mockUser = {
    ...mockUserData,
    save: jest.fn().mockResolvedValue(mockUserData), // Keep this for other tests if needed
};

const token = generateToken(mockUserData.id, process.env.JWT_SECRET_KEY!, '1h');
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcyN2Q0ZTQ3LTA0ZWItNGM0Ni04Yzc4LTAxZmQwNGI2NzJlNSIsImlhdCI6MTcyODY0NzM5MiwiZXhwIjoxNzI4NjUwOTkyfQ.zZx1I4ZXdFJSC_UHQ6ZH4q8pysjJR8SrVYxUIsuTqO8"

// Test cases for user signup
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

