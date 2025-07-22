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
import { boardSocket } from './socket/boardSocket.js';
import startReminderScheduler from './cron/deadlineReminder.js';
import { handleCommentSocket } from './socket/commentSocket.js';
import { getMainFeed } from './controllers/home.js';
import CommentRouter from './routes/comment.js'


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
  socket.on('register_user_socket', ({userId })=> {
    socket.join(`user_${userId}`);
  });
  
  workspaceSocketHandler(io, socket);
  boardSocket(io,socket);
  handleCommentSocket(io,socket)

  socket.on('disconnect', ()=>{
    console.log(`Socket disconnected: ${socket.id}`);
  });
});
startReminderScheduler(io);

app.get("/user-info",checkAuthentication,fetchUserInfo);
app.get('/api/home',checkAuthentication,getMainFeed)
app.use('/user',UserRouter);
app.use('/workspace',WorkspaceRouter);
app.use('/board',BoardRouter);
app.use('/card',CardRouter)
app.use('/search',searchRouter);
app.use('/notification',NotificationRouter)
app.use('/api/comment',CommentRouter);

server.listen(PORT,()=>console.log(`Server is running on port ${PORT}...`))





