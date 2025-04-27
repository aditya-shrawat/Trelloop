import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import UserRouter from './routes/user.js'
import cookieParser from 'cookie-parser';
import WorkspaceRouter from './routes/workspace.js';
import BoardRouter  from './routes/board.js'
import ListRouter from './routes/list.js'
import CardRouter from './routes/card.js'


const mongoDB = process.env.MongoDB_URL;
mongoose.connect(mongoDB)
.then(()=>console.log("MongoDB is connected."))
.catch((error)=>console.log(`Error while connecting mongoDB - ${error}`))

const app = express()
const PORT = 4000

app.use(cookieParser());
const frontend = process.env.Frontend_URL;
app.use(cors({
    origin: frontend,
    credentials: true
}));
app.use(express.json())

app.use('/user',UserRouter);
app.use('/workspace',WorkspaceRouter);
app.use('/board',BoardRouter);
app.use('/list',ListRouter);
app.use('/card',CardRouter)

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))





