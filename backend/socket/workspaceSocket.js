import Notification from "../models/notification.js";
import Workspace from "../models/workspace.js"


export const workspaceSocketHandler = (io, socket)=>{
    // Joining user in a room for direct notifications
    socket.on('register_user_socket', ({userId })=> {
        socket.join(`user_${userId}`);
    });

    // Joining workspace room
    socket.on('join_workspace_room', ({ workspaceId })=>{
        socket.join(`workspace_${workspaceId}`);
    });

    socket.on('send_workspace_invite', async ({workspaceId, userIds, senderId})=>{
        try {
            const workspace = await Workspace.findById(workspaceId);

            if (!workspace) {
                return socket.emit('error',{message:'Workspace not found'});
            }

            const invitedNow = [];

            userIds.forEach((userId) => {
                if(!workspace.members.includes(userId) && !workspace.pendingInvites.includes(userId) ){
                    workspace.pendingInvites.push(userId);
                    invitedNow.push(userId);
                }
            });
            await workspace.save();

            for(const userId of invitedNow){
                await Notification.create({
                    userId,
                    senderId,
                    type: "invite",
                    workspaceId,
                    message: `You have been invited to the workspace: ${workspace.name}`,
                });

                // notify invited users
                io.to(`user_${userId}`).emit("new_notification", {
                    workspaceId,
                    type: "invite",
                    message: `You have been invited to the workspace: ${workspace.name}`,
                });

                // (optional)
                // io.to(`user_${userId}`).emit('workspace_invite_received', {
                //     workspaceId,
                //     message: 'You have been invited to a workspace'
                // });
            }

            // notify the sender
            socket.emit('workspace_invite_sent', {
                workspaceId,
                invitedNow,
            });
        } catch (error) {
            console.error('Error while inviting users - :', error);
            socket.emit('error', { message:'Failed to send invites' });
        }
    });

    socket.on('accept_workspace_invite', async ({ workspaceId, userId })=> {
        try {
            const workspace = await Workspace.findById(workspaceId);

            if (!workspace) return socket.emit('error', { message:'Workspace not found.' });

            const isInvited = workspace.pendingInvites.includes(userId);
            if (!isInvited) return socket.emit('error', { message:'No invite found' });

            workspace.pendingInvites = workspace.pendingInvites.filter(id => id.toString() !== userId);
            workspace.members.push(userId);
            await workspace.save();

            socket.join(`workspace_${workspaceId}`);

            await Promise.all(
                workspace.members.map(async (memberId) => {
                    // skip notifying the joining user
                    if (memberId.toString() === userId) return;

                    await Notification.create({
                        userId:memberId,
                        senderId: userId,
                        type:"member_joined",
                        workspaceId,
                        message:`A new member has joined workspace: ${workspace.name}`,
                    });

                    // notify all the members
                    io.to(`user_${memberId}`).emit("new_notification", {
                        workspaceId,
                        type: "member_joined",
                        message: `A new member has joined workspace: ${workspace.name}`,
                    });
                })
            );

            // optional
            // io.to(`workspace_${workspaceId}`).emit('workspace_member_added', {
            //     workspaceId,
            //     userId,
            //     message: 'A new member has joined'
            // });

            socket.emit('workspace_invite_accepted', {workspaceId, userId });
        } catch (error) {
            console.error('Error in accepting invite- :', error);
            socket.emit('error', {message:'Failed to accept invite' });
        }
    });
}


