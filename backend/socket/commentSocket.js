import Card from "../models/card.js";
import Comment from "../models/Comment.js";
import User from "../models/user.js";


export const handleCommentSocket = (io, socket) => {
    socket.on('add_comment', async ({ cardId, content, senderId }) => {
        try {
            if (!cardId || !content || content.trim()==="" || !senderId) {
                return socket.emit('error', { message: 'Missing data.' });
            }

            const sender = await User.findById(senderId);
            if(!sender) return socket.emit('error',{message:"User not found."});

            const card = await Card.findById(cardId);
            if (!card) return socket.emit('error', { message: 'Card not found.' });

            await card.populate({
                path: 'list',
                populate: {
                    path: 'board',
                    populate: {
                    path: 'workspace'
                    }
                }
            });
            const board = card.list.board;
            const workspace = board.workspace;

            const isBoardMember = board.members?.some(id => id.toString() === senderId?.toString());
            const isBoardAdmin = board.admin?.toString() === senderId?.toString();
            const isWorkspaceMember = workspace.members?.some(id => id.toString() === senderId?.toString());
            const isWorkspaceAdmin = workspace.createdBy?.toString() === senderId?.toString();
            if(!isBoardAdmin && !isBoardMember && !isWorkspaceAdmin && !isWorkspaceMember) 
                return socket.emit('error',{message:"User doesn't have permission to perform this action."})

            await Comment.create({
                workspace:workspace._id,
                board:board._id,
                card:card._id,
                sender:senderId,
                content:content.trim(),
            })

            const notifyList = new Set([...board.members.map(id => id.toString()),board.admin?.toString()]);

            notifyList.forEach(memberId => {
                if (memberId && memberId !== senderId.toString()) {
                    io.to(`user_${memberId}`).emit("new_comment", {
                        cardId,
                        type: "comment",
                        message: `New comment on the card "${card.name}"`,
                    });
                }
            });

            socket.emit('comment_added',{cardId,content});
        } catch (error) {
            console.log("error in comment - ",error);
            socket.emit('error', { message: 'Internal server error.' });
        }
    });
};


