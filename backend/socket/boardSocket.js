import Board from "../models/board.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";



export const boardSocket = (io,socket) =>{
    socket.on('join_board_room', ({ boardId })=>{
        socket.join(`board_${boardId}`);
    });

    // sender = want to join board (request to board)
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

            board.pendingRequests.push(senderId);
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

    // sender = who is rejecting request, user = who sent the request
    socket.on('reject_board_request', async ({boardId,senderId,userId})=>{
        try {
            if(!boardId || !senderId || !userId) return;

            const board = await Board.findById(boardId);
            if(!board) return socket.emit('error',{message:"Board not found."})

            const sender = await User.findById(senderId);
            if(!sender) return socket.emit('error', {message:'User not found.' });
            const user = await User.findById(userId);
            if(!user) return socket.emit('error',{message:"User not found."})

            const boardAdmin = board.admin;
            const isMember = board.members?.some((member)=>member?.toString() === userId?.toString())  // userId should not an member
            const isAdmin = boardAdmin?.toString() === senderId?.toString() // is sender is admin
            const request = board.pendingRequests?.some((req)=>req?.toString()===userId?.toString());  // userId should be in pendingRequests

            if(!isAdmin) return socket.emit('error',{message:"Only the admin can reject requests."})
            if(isMember) return socket.emit('error',{message:"User is already a member of the board."})
            if(!request) return socket.emit('error',{message:"No pending request found for this user."})

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

    // sender = board admin , userId = who sent request to admin
    socket.on('accept_board_request', async ({boardId,senderId,userId})=>{
        try {
            if(!boardId || !senderId || !userId) return;

            const board = await Board.findById(boardId);
            if(!board) return socket.emit('error',{message:"Board not found."})
            
            const sender = await User.findById(senderId);
            if(!sender) return socket.emit('error', {message:'User not found.' });
            const user = await User.findById(userId);
            if(!user) return socket.emit('error',{message:"User not found."}) 

            const boardAdmin = board.admin;
            const isMember = board.members?.some((member)=>member?.toString() === userId?.toString())  // userId should not an member
            const isAdmin = boardAdmin?.toString() === senderId?.toString() // is sender is admin
            const request = board.pendingRequests?.some((req)=>req?.toString()===userId?.toString());  // userId should be in pendingRequests

            if(!isAdmin) return socket.emit('error',{message:"Only the admin can accept requests."})
            if(isMember) return socket.emit('error',{message:"User is already a member of the board."})
            if(!request) return socket.emit('error',{message:"No pending request found for this user."})

            board.pendingRequests = board.pendingRequests?.filter(
                (req) => req?.toString() !== userId?.toString()
            );
            board.members.push(userId);
            await board.save();

            socket.join(`board_${boardId}`);

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

    // sender = board/workspace admin 
    socket.on('send_board_invite', async ({boardId, userIds, senderId})=>{
        try {
            if(!boardId || !senderId || !userIds) return;

            const board = await Board.findById(boardId);
            if (!board) {
                return socket.emit('error',{message:'Board not found'});
            }
            await board.populate({path: 'workspace',select: 'createdBy'});
            const workspace = board.workspace ;

            const sender = await User.findById(senderId);
            if(!sender) return socket.emit('error', {message:'User not found.' }); 

            if( (senderId?.toString() !== board.admin?.toString()) && (senderId?.toString() !== workspace.createdBy?.toString()) ) 
                return socket.emit('error',{message:'Only the admin can send board invite.'});

            const invitedNow = [];

            userIds.forEach((userId) => {
                if(!board.members?.some(id => id.toString() === userId.toString()) && !board.pendingInvites?.some(id => id.toString() === userId.toString()) ){
                    board.pendingInvites.push(userId);
                    invitedNow.push(userId);
                }
            });
            await board.save();

            for(const userId of invitedNow){
                await Notification.create({
                    userId,
                    senderId,
                    type: "board_invite",
                    boardId,
                    message: `sent you an invite to the "${board.name}" board.`,
                });

                io.to(`user_${userId}`).emit("new_notification", {
                    boardId,
                    type: "board_invite",
                    message: `You have been invited to the board: ${board.name}`,
                });
            }

            socket.emit('board_invite_sent', {
                boardId,
                invitedNow,
            });
        } catch (error) {
            console.error('Error while inviting users - :', error);
            socket.emit('error', { message:'Failed to send invites' });
        }
    });

    // sender = accepting invite , user = who sent the invite
    socket.on('accept_board_invite', async ({ boardId,userId, senderId })=> {
        try {
            if(!boardId || !senderId || !userId)return;

            const board = await Board.findById(boardId);
            if (!board) return socket.emit('error', { message:'Board not found.' });

            const sender = await User.findById(senderId);
            if(!sender) return socket.emit('error', {message:'User not found.' }); 
            const user = await User.findById(userId); 
            if(!user) return socket.emit('error',{message:'User not found.' });

            const isInvited = board.pendingInvites?.some(id => id?.toString() === senderId?.toString());
            if (!isInvited) return socket.emit('error', { message:'No invite found' });

            const alreadyMember = board.members?.some(id => id?.toString() === senderId?.toString());
            if (alreadyMember) return socket.emit('error', { message:'User is already a member.' });

            board.pendingInvites = board.pendingInvites?.filter(id => id?.toString() !== senderId?.toString());
            board.members.push(senderId);
            await board.save();

            socket.join(`board_${boardId}`);

            const sendNotification = async (memberId,senderId,senderName)=>{
                if (memberId?.toString() === senderId?.toString()) return;

                await Notification.create({
                    userId:memberId,
                    senderId: senderId,
                    type:"board_invite_accepted",
                    boardId,
                    message:`has joined "${board.name}" board.`,
                });

                io.to(`user_${memberId}`).emit("new_notification", {
                    boardId,
                    type: "board_invite_accepted",
                    message: `${senderName} has joined board "${board.name}"`,
                });
            }
            
            const senderName = sender.name;
            await sendNotification(userId,senderId,senderName)
            await Promise.all(
                board.members?.map((memberId) => 
                    sendNotification(memberId,senderId,senderName)
                )
            );

            // socket.emit('board_invite_accepted', {boardId, senderId });
        } catch (error) {
            console.error('Error in accepting board invite- :', error);
            socket.emit('error', {message:'Failed to accept invite' });
        }
    });

    // sender = rejecting invite , user = who sent the invite
    socket.on('reject_board_invite', async ({ boardId,userId, senderId })=> {
        try {
            if(!boardId || !senderId || !userId) return;

            const board = await Board.findById(boardId);
            if (!board) return socket.emit('error', { message:'Board not found.' });

            const sender = await User.findById(senderId);
            if (!sender) return socket.emit('error', {message:'User not found.' });
            const user = await User.findById(userId); 
            if(!user) return socket.emit('error',{message:'User not found.' });

            const isInvited = board.pendingInvites?.some(id => id?.toString() === senderId?.toString());
            if (!isInvited) return socket.emit('error', { message:'No invite found' });

            const alreadyMember = board.members?.some(id => id?.toString() === senderId?.toString());
            if (alreadyMember) return socket.emit('error', { message:'User is already a member.' });

            board.pendingInvites = board.pendingInvites?.filter(id => id?.toString() !== senderId?.toString());
            await board.save();

            const senderName = sender.name;

            await Notification.create({
                userId:userId,
                senderId: senderId,
                type:"board_invite_rejected",
                boardId,
                message:`has rejected your invite to "${board.name}" board.`,
            });

            io.to(`user_${userId}`).emit("new_notification", {
                boardId,
                type: "board_invite_rejected",
                message: `${senderName} has rejected your invite to "${board.name}" board.`,
            });

            // socket.emit('board_invite_rejected', {boardId, senderId });
        } catch (error) {
            console.error('Error in rejecting invite- :', error);
            socket.emit('error', {message:'Failed to reject invite' });
        }
    });
}

