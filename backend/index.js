import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import UserRouter from './routes/user.js'
import cookieParser from 'cookie-parser';
import WorkspaceRouter from './routes/workspace.js';
import BoardRouter  from './routes/board.js'
import CardRouter from './routes/card.js'
import http from "http"
import {Server} from "socket.io"
import { workspaceSocketHandler } from './socket/workspaceSocket.js';
import searchRouter from './routes/search.js'
import checkAuthentication from './middlewares/authentication.js';
import { fetchUserInfo } from './controllers/userInfo.js';
import NotificationRouter from './routes/notification.js'


const mongoDB = process.env.MongoDB_URL;
mongoose.connect(mongoDB)
.then(()=>console.log("MongoDB is connected."))
.catch((error)=>console.log(`Error while connecting mongoDB - ${error}`))

const app = express()
const frontend = process.env.Frontend_URL;

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: frontend, credentials: true }
});
const PORT = 4000

app.use(cookieParser());

app.use(cors({
    origin: frontend,
    credentials: true
}));
app.use(express.json())

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  workspaceSocketHandler(io, socket);

  socket.on('disconnect', ()=>{
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

app.get("/user-info",checkAuthentication,fetchUserInfo);
app.use('/user',UserRouter);
app.use('/workspace',WorkspaceRouter);
app.use('/board',BoardRouter);
app.use('/card',CardRouter)
app.use('/search',searchRouter);
app.use('/notification',NotificationRouter)

server.listen(PORT,()=>console.log(`Server is running on port ${PORT}...`))





