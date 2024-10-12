import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import cors from 'cors';
import compression from 'compression';
import sequelize from "./db/sequelize";
import userRouter from "./routes/userRoute";
import commentRoute from "./routes/commentRoute";
import postRouter from "./routes/postRoute";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from "./swagger";

dotenv.config();

const app = express();
const port = process.env.PORT || 4020;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.json())
app.use(cors())
app.use(compression())

app.use('/v1/auth', userRouter)
app.use('/v1/post', postRouter)
app.use('/v1/comment', commentRoute)

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (process.env.NODE_ENV !== 'test') {
    sequelize.sync().then(() => {
        app.listen(port, () => {
            console.log(`Server is listening on http://localhost:${port}`);
        });
    });
}

export default app;