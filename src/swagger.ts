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
        }
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