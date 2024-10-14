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

LINK TO POSTMAN DOCUMENTATION: https://nodejstypescriptsequelize.postman.co/workspace/task~e84dface-e333-4a46-8aae-9b7d1e2b9e20/collection/27252824-718a6bd2-3f3f-45f0-ac08-8a9103ec2b14?action=share&creator=27252824

Steps taken in building
1. npm init -y
2. npm install --save-dev @types/bcryptjs @types/express @types/jest @types/jsonwebtoken @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint jest nodemon ts-jest ts-node typescript @types/cors @types/compression @types/swagger-jsdoc
3. npm install bcryptjs dotenv express joi jsonwebtoken pg pg-hstore redis sequelize compression cors swagger-jsdoc swagger-ui-express
4. initialize typescript npx tsc --init 
5. configure sequelize - npx sequelize-cli init
6. Create the model using - 
    ###### USER MODEL - npx sequelize-cli model:generate --name UserModel --attributes name:string
    ###### POST MODEL - npx sequelize-cli model:generate --name PostModel --attributes title:string
    ###### COMMENT MODEL - npx sequelize-cli model:generate --name CommentModel --attributes content:string
    After you see the generated migration and model, edit the model with the fields required and then leave the migration file in js whereas the model file is converted to ts then run the next step 
7. npx sequelize db:migrate
8. Install jest for unit test cases - npm i -D jest ts-jest @types/jest   
9. To run the test cases - npm run test
10. Set up swagger documentation
    npm i swagger-jsdoc npm i swagger-ui-express  
    npm i --save-dev @types/swagger-ui-express


STEPS TO RUN THE PROJECT:
1. Clone the repo
2. Set up your env using the naming convention on the .env.sample 
3. start your server and connect to the server - npm run dev
4. Navigate to the http://localhost:4020/api-docs to see the documentation on swagger 
5. Test all apis 
6. To run the tests using jest - npm run test
