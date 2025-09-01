
import Workspace from '../models/workspace.js';
import Board from '../models/board.js';
import List from '../models/list.js';
import Card from '../models/card.js';
import StarredBoard from '../models/starredBoard.js';
import Notification from '../models/notification.js';
import User from '../models/user.js';
import Activity from '../models/Activity.js';

export const createWorkspace = async (req,res)=>{
    try {
        const {name,description} = req.body ;
        const Description = (description.trim()==="")?"":description

        if(name.trim()===''){
            return res.status(400).json({error:"Workspace name is required."})
        }

        const workspace = await Workspace.create({
            name,
            description:Description,
            createdBy:req.user.id,
            isPrivate:true,
        });

        return res.status(201).json({message:"Workspace is created.",workspace})
    } catch (error) {
        console.log("Error while creating workspace - ",error);
        return res.status(500).json({message:"Internal server error."})
    }
}


export const fetchWorkspaces = async (req,res)=>{
    try {
        const userId = req.user._id ;
        
        const ownWorkspaces = await Workspace.find({createdBy:userId});
        const memberedWorkspaces = await Workspace.find({members:userId,createdBy:{$ne:userId }});

        const allWorkspaces = [...ownWorkspaces, ...memberedWorkspaces]
        .sort((a, b)=> new Date(b.createdAt) - new Date(a.createdAt));

        return res.status(200).json({message:"Workspaces fetched successfully.",workspaces:allWorkspaces});
    } catch (error) {
        console.log("Error while fetching workspaces - ",error);
        return res.status(500).json({error:"Internal server error."});
    }
}


export const getWorkspaceData = async (req,res)=>{
    try {
        const workspaceId = req.params.id;

        const workspace = await Workspace.findById(workspaceId).select('name description createdBy members isPrivate');

        return res.status(200).json({message:"Workspace fetched successfully.",workspace})
    } catch (error) {
        console.log("Error while fetching workspace - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}


export const updateWorkspace = async (req,res)=>{
    try {
        const {newName,newDescription} = req.body ;

        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to edit this workspace." });
        }

        if(newName.trim()===""){
            return res.status(400).json({error:"Workspace name is required."})
        }

        const workspace = req.workspace;

        const userId = req.user._id; 

        const previousName = workspace.name;
        const previousDescription = workspace.description;

        if (newName) workspace.name = newName;
        if (newDescription) workspace.description = newDescription;
        await workspace.save();

        const nameUpdated = newName && newName !== previousName;
        const descriptionUpdated = newDescription && newDescription !== previousDescription;

        if (!nameUpdated && !descriptionUpdated) {
            return res.status(200).json({ message: "No changes were made to the workspace.", workspace });
        }

        let type = "";
        let data = {};

        if (nameUpdated && descriptionUpdated) {
            type = "workspace_newInfo" //name and description changed
            data= {
                workspace_oldName : previousName,
                workspace_newName : workspace.name,
            }
        } else if (nameUpdated) {
            type = "workspace_renamed"
            data = {
                workspace_oldName : previousName,
                workspace_newName : workspace.name,
            }
        } else if (descriptionUpdated) {
            type = "workspace_newDesc" // description changed
            data = {
                workspace_name : workspace.name,
                workspace_id : workspace._id
            }
        }

        await Activity.create({
            workspace:workspace._id,
            user:userId,
            type,
            data,
            createdAt: new Date()
        })

        return res.status(200).json({message:"Workspace updated successfully.",workspace})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const deleteWorkspace = async (req, res) => {
    try {
      const workspace = req.workspace;

      if(workspace.createdBy?.toString() !== req.user.id)
        return res.status(403).json({error:"Workspace admin can delete workspace."})
  
      const boards = await Board.find({ workspace: workspace._id });
  
      const boardIds = boards.map(board => board._id);

      const listIds = await List.find({ board: { $in: boardIds } }).distinct('_id');

      await Card.deleteMany({ list: { $in: listIds } });

      await List.deleteMany({ board: { $in: boardIds } });

      await StarredBoard.deleteMany({ board: { $in: boardIds } });

      await Board.deleteMany({ workspace: workspace._id });

        const userId = req.user._id;

        const notifyMembers = async (senderId,receiverId)=>{
            await Notification.create({
                userId:receiverId,
                senderId:senderId,
                type:"workspace_deleted",
                workspaceId:workspace._id,
                message:`deleted the workspace "${workspace.name}".`,
            });
        }

        await Promise.all(
            workspace.members.map((member) =>
                notifyMembers(userId, member._id)
            )
        );
  
      await workspace.deleteOne();
  
      return res.status(200).json({ message: "Workspace deleted successfully." });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error." });
    }
}

export const fetchWorkspaceMembers = async (req,res)=>{
    try {
        const {name,id} = req.params 

        const workspace = req.workspace;

        await workspace.populate("createdBy members","firstName lastName username profileImage");

        return res.status(200).json({message:"Workspace members fetched successfully.",
            members:workspace.members,admin:workspace.createdBy,currentUser:req.user
        })
    } catch (error) {
        return res.status(500).json({error:"Internal server error."});
    }
}


export const updateWorkspaceVisibility = async (req,res)=>{
    try {
        const {id} = req.params ;
        const {newVisibility} = req.body ;

        if (!req.isCreator) {
            return res.status(403).json({ error: "You don't have permission to edit this workspace." });
        }

        if(typeof newVisibility !== "boolean"){
            return res.status(403).json({error:`${newVisibility} visibility doesn't exist`});
        }
        
        const workspace = await Workspace.findById(id).select('name description createdBy members isPrivate') ;

        if(!workspace){
            return res.status(404).json({error:"Workspace doesn't exist."})
        }

        const prevVisibility = workspace.isPrivate;
        workspace.isPrivate = newVisibility
        await workspace.save() ;

        await Activity.create({
            workspace:workspace._id,
            user:req.user.id,
            type:'workspace_visibility_updated',
            data:{
                prevVisibility,
                newVisibility:workspace.isPrivate,
                workspace_name:workspace.name,
            },
            createdAt: new Date()
        })

        return res.status(200).json({message:"Workspace visibility updated successfully.",workspace})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const removeWorkspaceMember = async (req,res)=>{
    try {
        const {id} = req.params
        const {userId} = req.body

        const workspace = req.workspace;

        if(req.user.id !== workspace.createdBy?.toString()){
            return res.status(403).json({error:"Only admin can remove members."})
        }

        const user = await User.findById(userId);

        workspace.members = workspace.members.filter(memberId => memberId.toString() !== userId);
        await workspace.save();

        const notifyMembers = async (senderId,receiverId,receiverName)=>{
            await Notification.create({
                userId:receiverId,
                senderId:senderId,
                type:"member_removed",
                workspaceId:workspace._id,
                message:`removed ${receiverName} from the workspace "${workspace.name}".`,
            });
        }

        const adminId = workspace.createdBy
        await notifyMembers(adminId,userId,"you") // notify removed user

        const userName = `"${user.name}"`
        // notify other members
        await Promise.all(
            workspace.members.map((member) =>
                notifyMembers(adminId, member._id, userName)
            )
        );

        await workspace.populate("members", "name _id");

        return res.status(200).json({message:"User removed successfully.",members:workspace.members})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const leaveWorkspace = async (req,res)=>{
    try {
        const userId = req.user._id
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error:"user doesn't exist."})
        }

        const workspace = req.workspace;
        if (workspace.createdBy.toString() === userId) {
            return res.status(403).json({error:"Admin cannot leave the workspace." });
        }

        const isMember = workspace.members?.some((id) => id?.toString() === userId?.toString());
        if (!isMember) {
            return res.status(400).json({ error: "User is not a member of this workspace." });
        }
        workspace.members = workspace.members?.filter((id)=> id?.toString() !== userId?.toString());
        await workspace.save();

        const notifyMembers = async (senderId,receiverId)=>{
            await Notification.create({
                userId:receiverId,
                senderId:senderId,
                type:"member_left",
                workspaceId:workspace._id,
                message:`left the workspace "${workspace.name}".`,
            });
        }

        await notifyMembers(userId,workspace.createdBy) // notify admin

        await workspace.populate("members", "name _id");
        // notify other members
        await Promise.all(
            workspace.members.map((member) =>
                notifyMembers(userId, member._id)
            )
        );

        return res.status(200).json({message:"User left workspace successfully.",members:workspace.members})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const getWorkspaceActivies= async (req,res)=>{
    try {
        const {id} = req.params;
        
        const workspace = req.workspace;

        const workspaceActivities = await Activity.find({workspace:workspace._id})
        .select("workspace board card user type data createdAt").populate("user",'_id firstName lastName username profileImage')

        const activities = workspaceActivities.sort((a, b) => b.createdAt - a.createdAt);

        return res.status(200).json({message:"Workspace activities fetched succssfully.",activities})
    } catch (error) {
        console.log("Error in fetching workspace activities - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}
