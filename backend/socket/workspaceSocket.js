import Notification from "../models/notification.js";
import User from "../models/user.js";
import Workspace from "../models/workspace.js"


export const workspaceSocketHandler = (io, socket)=>{
    socket.on('join_workspace_room', ({ workspaceId })=>{
        socket.join(`workspace_${workspaceId}`);
    });

    socket.on('send_workspace_invite', async ({workspaceId, userIds, senderId})=>{
        try {
            const workspace = await Workspace.findById(workspaceId);

            if (!workspace) {
                return socket.emit('error',{message:'Workspace not found'});
            }

            if(senderId.toString() !== workspace.createdBy?.toString()) 
                return socket.emit('error',{message:'You are not admin.Not allowed'});

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
                    message: `sent you an invite to the "${workspace.name}" workspace.`,
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

            const isInvited = workspace.pendingInvites.some(id => id.toString() === userId.toString());
            if (!isInvited) return socket.emit('error', { message:'No invite found' });

            const alreadyMember = workspace.members.some(id => id.toString() === userId.toString());
            if (alreadyMember) return socket.emit('error', { message:'User is already a member.' });

            workspace.pendingInvites = workspace.pendingInvites.filter(id => id.toString() !== userId.toString());
            workspace.members.push(userId);
            await workspace.save();

            socket.join(`workspace_${workspaceId}`);

            const sendNotification = async (memberId,senderId,senderName)=>{
                // skip notifying the joining user
                if (memberId.toString() === senderId) return;

                await Notification.create({
                    userId:memberId,
                    senderId: senderId,
                    type:"member_joined",
                    workspaceId,
                    message:`has joined "${workspace.name}" workspace.`,
                });

                // notify the members
                io.to(`user_${memberId}`).emit("new_notification", {
                    workspaceId,
                    type: "member_joined",
                    message: `${senderName} has joined workspace "${workspace.name}"`,
                });
            }

            const updatedWorkspace = await Workspace.findById(workspace._id)
            .populate("members", "firstName lastName username profileImage email");

            const user = await User.findById(userId);
            if(!user) return socket.emit('error', {message:'User not found.' }); 
            const userName = user.firstName + " " + user.lastName;

            await sendNotification(updatedWorkspace.createdBy,userId.toString(),userName)
            await Promise.all(
                updatedWorkspace.members.map((memberId) => 
                    sendNotification(memberId,userId,userName)
                )
            );

            io.to(`workspace_${workspaceId}`).emit('workspace_member_added', {
                workspaceId,
                userId,
                allMembers:updatedWorkspace.members,
            });

            socket.emit('workspace_invite_accepted', {workspaceId, userId });
        } catch (error) {
            console.error('Error in accepting invite- :', error);
            socket.emit('error', {message:'Failed to accept invite' });
        }
    });

    socket.on('reject_workspace_invite', async ({ workspaceId, userId })=> {
        try {
            const workspace = await Workspace.findById(workspaceId);

            if (!workspace) return socket.emit('error', { message:'Workspace not found.' });

            const isInvited = workspace.pendingInvites.some(id => id.toString() === userId.toString());
            if (!isInvited) return socket.emit('error', { message:'No invite found' });

            const alreadyMember = workspace.members.some(id => id.toString() === userId.toString());
            if (alreadyMember) return socket.emit('error', { message:'User is already a member.' });

            workspace.pendingInvites = workspace.pendingInvites.filter(id => id.toString() !== userId.toString());
            await workspace.save();

            const user = await User.findById(userId);
            if (!user) return socket.emit('error', {message:'User not found.' }); 
            const userName = user.firstName + " " + user.lastName;
            const adminId = workspace.createdBy?.toString();

            // send notification to admin
            await Notification.create({
                userId:adminId,
                senderId: userId,
                type:"invite_rejected",
                workspaceId,
                message:`has rejected your invite to "${workspace.name}" workspace.`,
            });

            io.to(`user_${adminId}`).emit("new_notification", {
                workspaceId,
                type: "invite_rejected",
                message: `${userName} has rejected your invite to "${workspace.name}" workspace.`,
            });

            socket.emit('workspace_invite_rejected', {workspaceId, userId });
        } catch (error) {
            console.error('Error in rejecting invite- :', error);
            socket.emit('error', {message:'Failed to reject invite' });
        }
    });
}


