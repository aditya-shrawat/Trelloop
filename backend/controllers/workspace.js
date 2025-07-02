
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
        const Description = (description.trim()==="")?"":req.board.description

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
        const userId = req.user.id ;
        
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

        const workspace = await Workspace.findById(workspaceId).select('name description createdBy isPrivate');

        return res.status(200).json({message:"Workspace fetched successfully.",workspace})
    } catch (error) {
        console.log("Error while fetching workspace - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}


export const updateWorkspace = async (req,res)=>{
    try {
        const {id} = req.params ;
        const {newName,newDescription} = req.body ;

        if(newName.trim()===""){
            return res.status(400).json({error:"Workspace name is required."})
        }

        const workspace = await Workspace.findById(id) ;

        if(!workspace){
            return res.status(404).json({error:"Workspace doesn't exist."})
        }

        const userId = req.user.id;
        const isCreator = workspace.createdBy?.toString() === userId;
        const isMember = workspace.members.includes(userId);

        if (!isCreator && !isMember){
            return res.status(403).json({error:"You are not allowed to update this workspace."});
        }

        workspace.name = newName
        workspace.description = newDescription ;

        await workspace.save() ;

        return res.status(200).json({message:"Workspace updated successfully.",workspace})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const deleteWorkspace = async (req, res) => {
    try {
      const { id } = req.params;
  
      const workspace = await Workspace.findById(id);
      if (!workspace) {
        return res.status(404).json({ error: "Workspace doesn't exist." });
      }

      if(workspace.createdBy?.toString() !== req.user.id)
        return res.status(403).json({error:"Not allowed to delete workspace.Only admin can."})
  
      const boards = await Board.find({ workspace: id });
  
      for (const board of boards) {
        const lists = await List.find({ board: board._id });
  
        for (const list of lists) {
          await Card.deleteMany({ list: list._id });
        }
  
        await List.deleteMany({ board: board._id });
        await StarredBoard.deleteMany({ board: board._id });
      }
  
      await Board.deleteMany({ workspace: id });
  
      await workspace.deleteOne();
  
      return res.status(200).json({ message: "Workspace deleted successfully." });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error." });
    }
}

export const fetchWorkspaceMembers = async (req,res)=>{
    try {
        const {name,id} = req.params 

        const workspace = await Workspace.findById(id);
        if(!workspace){
            return res.status(400).json({error:"Workspace not found."})
        }

        await workspace.populate("createdBy members","name");

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

        const workspace = await Workspace.findById(id).select('name description createdBy members isPrivate') ;

        if(!workspace){
            return res.status(404).json({error:"Workspace doesn't exist."})
        }

        const userId = req.user.id;
        const isCreator = workspace.createdBy?.toString() === userId;
        const isMember = workspace.members.includes(userId);

        if (!isCreator && !isMember){
            return res.status(403).json({error:"You are not allowed to update this workspace."});
        }

        workspace.isPrivate = newVisibility
        await workspace.save() ;

        return res.status(200).json({message:"Workspace visibility updated successfully.",workspace})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const removeWorkspaceMember = async (req,res)=>{
    try {
        const {id} = req.params
        const {userId} = req.body

        const workspace = await Workspace.findById(id);

        if(req.user.id !== workspace.createdBy?.toString()){
            return res.status(403).json({error:"Only admin can remove members."})
        }

        const user = await User.findById(userId);

        workspace.members = workspace.members.filter((user)=> user._id.toString() !== userId);
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
        const {id} = req.params
        const userId = req.user.id

        const workspace = await Workspace.findById(id);

        if (workspace.createdBy.toString() === userId) {
            return res.status(403).json({error:"Admin cannot leave the workspace." });
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({error:"user doesn't exist."})
        }

        workspace.members = workspace.members.filter((user)=> user._id.toString() !== userId);
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

        // notify other members
        await Promise.all(
            workspace.members.map((member) =>
                notifyMembers(userId, member._id)
            )
        );

        await workspace.populate("members", "name _id");

        return res.status(200).json({message:"User left workspace successfully.",members:workspace.members})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const getWorkspaceActivies= async (req,res)=>{
    try {
        const {id} = req.params;
        
        const workspace = await Workspace.findById(id);
        if (!workspace) {
        return res.status(404).json({ message: "Workspace not found." });
        }

        const workspaceActivities = await Activity.find({workspace:workspace._id})
        .select("workspace board card user type data createdAt").populate("user",'_id name')

        const activities = workspaceActivities.sort((a, b) => b.createdAt - a.createdAt);

        return res.status(200).json({message:"Workspace activities fetched succssfully.",activities})
    } catch (error) {
        console.log("Error in fetching workspace activities - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}
