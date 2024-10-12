import swaggerJSDoc from 'swagger-jsdoc';
const swaggerDefinition = {
    info: {
        title: 'PostHub API Documentation',
        version: '1.0.0',
        description: 'PostHub API is a RESTful service using Node.js, Express, TypeScript, and PostgreSQL for creating posts and comments. Includes token-based authentication, and optimized queries for top users.',
    },
    host: 'localhost:4020',
    basePath: '/',
    paths: {
        '/v1/auth/signup': {
            post: {
                summary: 'Register a new user',
                description: 'Registers a new user with the provided details',
                tags: ['Users'],
                parameters: [
                    {
                        in: 'body',
                        name: 'user',
                        description: 'user details',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                firstName: {
                                    type: 'string',
                                    description: 'The first name of the user',
                                },
                                lastName: {
                                    type: 'string',
                                    description: 'The last name of the user',
                                },
                                country: {
                                    type: 'string',
                                    description: 'The country of the user',
                                },
                                email: {
                                    type: 'string',
                                    description: 'The email of the user',
                                    format: 'email',
                                },
                                password: {
                                    type: 'string',
                                    description: 'The password of the user',
                                },
                            },
                        },
                    },
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/User',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User registered successfully',
                        schema: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                    400: {
                        description: 'Bad Request',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            }
        },
        '/v1/auth/login': {
            post: {
                summary: 'User login',
                description: 'Logs in a user using their email and password',
                tags: ['Users'],
                parameters: [
                    {
                        in: 'body',
                        name: 'user',
                        description: 'user credentials',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                email: {
                                    type:'string',
                                    description: 'The email of the user',
                                    format: 'email',
                                },
                                password: {
                                    type:'string',
                                    description: 'The password of the user',
                                },
                            },
                        },
                    },
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/User',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'User logged in successfully',
                        schema: {
                            type: 'object',
                            properties: {
                                token: { type:'string' },
                                user: { $ref: '#/components/schemas/User' },
                            },
                        },
                    },
                    400: {
                        description: 'Bad Request',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/v1/auth/': {
            get: {
                summary: 'Get user details',
                description: 'Retrieves the user details for the authenticated user',
                tags: ['Users'],
                security: [
                    { JWTAuth: [] }
                ],
                responses: {
                    200: {
                        description: 'User details retrieved successfully',
                        schema: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            }
        },
        '/v1/auth/{userId}': {
            get: {
                summary: 'Get user details by id',
                description: 'Retrieves the user details for the specified user',
                tags: ['Users'],
                parameters: [
                    {
                        in: 'path',
                        name: 'userId',
                        description: 'The ID of the user',
                        required: true,
                        schema: {
                            type:'string',
                            format: 'uuid',
                        },
                    },
                ],
                security: [
                    { JWTAuth: [] }
                ],
                responses: {
                    200: {
                        description: 'User details retrieved successfully',
                        schema: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'User not found',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            }
        },
        '/v1/auth/{userId}/posts': {
            post: {
                summary: 'Create a new post',
                description: 'Creates a new post for the authenticated user',
                tags: ['Users'],
                parameters: [
                    {
                        in: 'path',
                        name: 'userId',
                        description: 'The ID of the user',
                        required: true,
                        schema: {
                            type:'string',
                            format: 'uuid',
                        },
                    },
                    {
                        in: 'body',
                        name: 'post',
                        description: 'post details',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                title: {
                                    type:'string',
                                    description: 'The title of the post',
                                },
                                content: {
                                    type:'string',
                                    description: 'The content of the post',
                                },
                            },
                        },
                    }
                ],
                security: [
                    { JWTAuth: [] }
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: {
                                        type:'string',
                                        description: 'The title of the post',
                                    },
                                    content: {
                                        type:'string',
                                        description: 'The content of the post',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Post created successfully',
                        schema: {
                            $ref: '#/components/schemas/Post',
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                }
            }
        },
        '/v1/post/create/{userId/': {
            post: {
                summary: 'Create a new post',
                description: 'Creates a new post for the specified user',
                tags: ['Posts'],
                parameters: [
                    {
                        in: 'path',
                        name: 'userId',
                        description: 'The ID of the user',
                        required: true,
                        schema: {
                            type:'string',
                            format: 'uuid',
                        },
                    },
                    {
                        in: 'body',
                        name: 'post',
                        description: 'post details',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                title: {
                                    type:'string',
                                    description: 'The title of the post',
                                },
                                content: {
                                    type:'string',
                                    description: 'The content of the post',
                                },
                            },
                        },
                    },
                ],
                security: [
                    { JWTAuth: [] }
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: {
                                        type:'string',
                                        description: 'The title of the post',
                                    },
                                    content: {
                                        type:'string',
                                        description: 'The content of the post',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Post created successfully',
                        schema: {
                            $ref: '#/components/schemas/Post',
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/v1/post/users/{userId}': {
            get: {
                summary: 'Get post details by id',
                description: 'Retrieves the post details for the specified user',
                tags: ['Posts'],
                parameters: [
                    {
                        in: 'path',
                        name: 'userId',
                        description: 'The ID of the user',
                        required: true,
                        schema: {
                            type:'string',
                            format: 'uuid',
                        },
                    },
                ],
                security: [
                    { JWTAuth: [] }
                ],
                responses: {
                    200: {
                        description: 'Post details retrieved successfully',
                        schema: {
                            $ref: '#/components/schemas/Post',
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'Post not found',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            }
        },
        '/v1/post/': {
            get: {
                summary: 'Get all posts',
                description: 'Retrieves all posts for the authenticated user',
                tags: ['Posts'],
                security: [
                    { JWTAuth: [] }
                ],
                responses: {
                    200: {
                        description: 'Posts retrieved successfully',
                        schema: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Post',
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/v1/post/{id}': {
            get: {
                summary: 'Get post details by id',
                description: 'Retrieves the post details for the specified post ID',
                tags: ['Posts'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        description: 'The ID of the post',
                        required: true,
                        schema: {
                            type:'string',
                            format: 'uuid',
                        },
                    },
                ],
                security: [
                    { JWTAuth: [] }
                ],
                responses: {
                    200: {
                        description: 'Post details retrieved successfully',
                        schema: {
                            $ref: '#/components/schemas/Post',
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'Post not found',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/v1/comment/create/{postId}': {
            post: {
                summary: 'Create a new comment',
                description: 'Creates a new comment for the specified post',
                tags: ['Comments'],
                parameters: [
                    {
                        in: 'path',
                        name: 'postId',
                        description: 'The ID of the post',
                        required: true,
                        schema: {
                            type:'string',
                            format: 'uuid',
                        },
                    },
                    {
                        in: 'body',
                        name: 'comment',
                        description: 'comment details',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                content: {
                                    type:'string',
                                    description: 'The content of the comment',
                                },
                            },
                        },
                    },
                ],
                security: [
                    { JWTAuth: [] }
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    content: {
                                        type:'string',
                                        description: 'The content of the comment',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Comment created successfully',
                        schema: {
                            $ref: '#/components/schemas/Comment',
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'Post not found',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/v1/comment/get-latest-comments': {
            get: {
                summary: 'Get latest comments',
                description: 'Retrieves the 3 top users with their latest comments for all posts',
                tags: ['Comments'],
                security: [
                    { JWTAuth: [] }
                ],
                responses: {
                    200: {
                        description: 'Latest comments retrieved successfully',
                        schema: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Comment',
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            }
        },
    },
    securityDefinitions: {
        JWTAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { 
                        type: "string", 
                        format: "uuid" 
                    },
                    firstName: { 
                        type: "string" 
                    },
                    lastName: { 
                        type: "string" 
                    },
                    country: { 
                        type: "string" 
                    },
                    email: { 
                        type: "string" 
                    },
                    password: { 
                        type: "string", 
                    },
                    createdAt: { 
                        type: "string", 
                        format: "date-time" 
                    },
                    updatedAt: { 
                        type: "string", 
                        format: "date-time" 
                    },
                },
                required: ['firstName', 'lastName', 'country', 'email', 'password']
            },
            Comment: {
                type: 'object',
                properties: {
                    id: { 
                        type: "string", 
                        format: "uuid" 
                    },
                    content: { 
                        type: "string" 
                    },
                    userId: { 
                        type: "string", 
                        format: "uuid" 
                    },
                    postId: { 
                        type: "string", 
                        format: "uuid" 
                    },
                    createdAt: { 
                        type: "string", 
                        format: "date-time" 
                    },
                    updatedAt: { 
                        type: "string", 
                        format: "date-time" 
                    },
                },
                required: ['content', 'userId', 'postId']
            },
            Post: {
                type: 'object',
                properties: {
                    id: { 
                        type: "string", 
                        format: "uuid" 
                    },
                    title: { 
                        type: "string" 
                    },
                    content: { 
                        type: "string" 
                    },
                    userId: { 
                        type: "string", 
                        format: "uuid" 
                    },
                    createdAt: { 
                        type: "string", 
                        format: "date-time" 
                    },
                    updatedAt: { 
                        type: "string", 
                        format: "date-time" 
                    },
                },
                required: ['title', 'content', 'userId']
            },
        }
    }

};

const options = {
    swaggerDefinition,
    apis: ["src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;