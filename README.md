# PostHub-API

##### PostHub API is a RESTful API built using Node.js, Express, TypeScript, and PostgreSQL. It enables users to create posts, add comments, and retrieve information efficiently. The API is containerized using Docker, and it supports token-based authentication, input validation, and error handling. The API is designed to be performant, with optimized queries for fetching the top users with the most posts and their latest comments.

## Features
#### User Management: Create and retrieve users.
#### Post Management: Create posts for users and fetch all posts for a specific user.
#### Comment Management: Add comments to posts.
#### Performance Challenge: Efficiently fetch the top 3 users with the most posts and their latest comments.
#### Authentication: Token-based authentication using JWT.
#### Data Validation: Validates inputs using TypeScript types and ensures correct data flow.
#### Error Handling: Handles various API errors and provides meaningful feedback.
#### Caching: Redis caching for improving the performance of frequently requested data.
#### Database: PostgreSQL used for relational data, with Sequelize as the ORM.

## Tech Stack
#### Backend: Node.js, Express, TypeScript
#### Database: PostgreSQL with Sequelize ORM
#### Caching: Redis
#### Testing: Jest, Supertest
#### Documentation: Postman Collection and Swagger
#### Authentication: JWT