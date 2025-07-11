import Board from "../models/board.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";



export const boardSocket = (io,socket) =>{
    socket.on('join_board_room', ({ boardId })=>{
        socket.join(`board_${boardId}`);
    });

    socket.on('send_board_request', async ({boardId,senderId})=>{
        try {
            if(!boardId || !senderId) return;

            const board = await Board.findById(boardId);
            if(!board) return socket.emit('error',{message:"Board not found."})
            
            const sender = await User.findById(senderId);
            if(!sender) return socket.emit('error',{message:"User not found."})

            const boardAdmin = board.admin;
            const isMember = board.members?.some((member)=>member?.toString() === senderId?.toString())
            const request = board.pendingRequests?.some((req)=>req?.toString()===senderId?.toString());
            const isAdmin = boardAdmin?.toString() === senderId?.toString()

            if(isAdmin || isMember) return socket.emit('error',{message:"User is already a member."})
            if(request) return socket.emit('error',{message:"Board request already exist."})

            board.pendingRequests.push(senderId?.toString());
            await board.save();

            io.to(`user_${boardAdmin}`).emit("new_notification",{
                boardId,
                type: 'request',
                message: `${sender.name} requested to join the ${board.name} board.`
            })

            await Notification.create({
                userId:boardAdmin,
                senderId,
                type: "board_request",
                boardId,
                message: `requested to join your board "${board.name}".`
            });

            socket.emit('board_request_sent',{
                boardId
            })
        } catch (error) {
            console.log("Error while sending board request - ",error)
            return socket.emit('error',{message:"Something went wrong."})
        }
    })

    socket.on('reject_board_request', async ({boardId,senderId,userId})=>{
        try {
            if(!boardId || !senderId || !userId) return;

            const board = await Board.findById(boardId);
            if(!board) return socket.emit('error',{message:"Board not found."})

            const boardAdmin = board.admin;
            const isMember = board.members?.some((member)=>member?.toString() === userId?.toString())  // userId should not an member
            const isAdmin = boardAdmin?.toString() === senderId?.toString() // is sender is admin
            const request = board.pendingRequests?.some((req)=>req?.toString()===userId?.toString());  // userId should be in pendingRequests

            if(!isAdmin) return socket.emit('error',{message:"Only the admin can reject requests."})
            if(isMember) return socket.emit('error',{message:"User is already a member of the board."})
            if(!request) return socket.emit('error',{message:"No pending request found for this user."})

            const user = await User.findById(userId);
            if(!user) return socket.emit('error',{message:"User not found."})

            board.pendingRequests = board.pendingRequests?.filter(
                (req) => req?.toString() !== userId?.toString()
            );
            await board.save();

            io.to(`user_${userId}`).emit("new_notification",{
                boardId,
                type: 'request_rejected',
                message: `Board admin rejected your request to join the "${board.name}" board.`
            })

            await Notification.create({
                userId:userId,
                senderId:boardAdmin,
                type: "board_request_rejected",
                boardId,
                message: `rejected your request to join the board "${board.name}".`
            });
        } catch (error) {
            console.log("Error while rejecting board request - ",error)
            return socket.emit('error',{message:"Something went wrong."})
        }
    })

    socket.on('accept_board_request', async ({boardId,senderId,userId})=>{
        try {
            if(!boardId || !senderId || !userId) return;

            const board = await Board.findById(boardId);
            if(!board) return socket.emit('error',{message:"Board not found."})

            const boardAdmin = board.admin;
            const isMember = board.members?.some((member)=>member?.toString() === userId?.toString())  // userId should not an member
            const isAdmin = boardAdmin?.toString() === senderId?.toString() // is sender is admin
            const request = board.pendingRequests?.some((req)=>req?.toString()===userId?.toString());  // userId should be in pendingRequests

            if(!isAdmin) return socket.emit('error',{message:"Only the admin can accept requests."})
            if(isMember) return socket.emit('error',{message:"User is already a member of the board."})
            if(!request) return socket.emit('error',{message:"No pending request found for this user."})

            const user = await User.findById(userId);
            if(!user) return socket.emit('error',{message:"User not found."})

            board.pendingRequests = board.pendingRequests?.filter(
                (req) => req?.toString() !== userId?.toString()
            );
            board.members.push(userId?.toString());
            await board.save();

            io.to(`user_${userId}`).emit("new_notification",{
                boardId,
                type: 'request_accepted',
                message: `Board admin accepted your request to join the "${board.name}" board.`
            })

            await Notification.create({
                userId:userId,
                senderId:boardAdmin,
                type: "board_request_accepted",
                boardId,
                message: `accepted your request to join the board "${board.name}".`
            });
        } catch (error) {
            console.log("Error while accepting board request - ",error)
            return socket.emit('error',{message:"Something went wrong."})
        }
    })
}

