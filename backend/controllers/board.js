import Activity from "../models/Activity.js";
import Board from "../models/board.js";
import Card from "../models/card.js";
import List from "../models/list.js";
import Notification from "../models/notification.js";
import StarredBoard from "../models/starredBoard.js";
import User from "../models/user.js";
import Workspace from "../models/workspace.js";



export const createBoard = async (req,res)=>{
    try {
        const {workspaceId,boardName,background} = req.body

        if (!req.canEdit) {
            return res.status(403).json({ error: "You are not allowed to create board." });
        }

        if(!workspaceId || !boardName){
            return res.status(400).json({error:"All fields are required!"})
        }

        const workspace = req.workspace;

        const board = await Board.create({
            name:boardName,
            workspace:workspace._id,
            admin:req.user.id,
            background
        });

        await Activity.create({
            workspace:workspaceId,
            board:board._id,
            user:req.user.id,
            type:'board_created',
            data:{
                board_name:board.name,
                workspace_name:workspace.name,
                boardId:board._id
            },
            createdAt: new Date()
        })

        return res.status(200).json({message:"Board created successfully.",board})
    } catch (error) {
        console.log("Error while creating board - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}

export const fetcheBoards = async (req,res)=>{
    try {
        const {id} = req.params

        const boards = await Board.find({workspace:id}).select('name background') ;

        return res.status(200).json({message:"Boards fetched successfully.",boards});
    } catch (error) {
        console.log("Error while fetching boards - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}

export const getBoardData = async (req,res)=>{
    try {
        const {boardId} = req.params ;

        const board = await Board.findById(boardId).select("name workspace admin members pendingRequests visibility background").populate("admin",'name')
        .populate({path: "workspace",select: "name members createdBy"});
        if(!board){
            return res.status(404).json({error:"Board not found."})
        }

        return res.status(200).json({message:"Board data fetched successfully.",board})
    } catch (error) {
        console.log("Error in fetching board data - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}


export const getBoardStarStatus = async (req,res)=>{
    try {
        const {boardId} = req.params
        const userId = req.user.id;

        const existingStarredBoard = await StarredBoard.findOne({board:boardId,user:userId });

        if(existingStarredBoard){
            return res.status(200).json({message:"Board starred.",starStatus:true });
        }
        return res.status(200).json({message:"Board unstarred.",starStatus:false });
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const toggleBoardStarStatus = async (req,res)=>{
    try {
        const {boardId} = req.params
        const userId = req.user.id;

        const board = await Board.findById(boardId);
        if(!board){
            return res.status(404).json({error:"Board doesn't exist."})
        }
        
        const existingStarredBoard = await StarredBoard.findOne({board:boardId,user:userId });

        if (existingStarredBoard) {
            await StarredBoard.findOneAndDelete({_id:existingStarredBoard._id });
            return res.status(200).json({message:"Board unstarred.",starStatus:false});
        } else {
            const newStar = new StarredBoard({board:boardId,user:userId});
            await newStar.save();
            return res.status(200).json({message:"Board starred.",starStatus:true });
        }
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const getStarredBoards = async (req,res)=>{
    try {
        const userId = req.user.id ;

        const starredBoardsIds = await StarredBoard.find({user:userId}).select("board").sort({createdAt:-1});

        const starredBoards = await Promise.all(
            starredBoardsIds.map(async (obj) => {
                return await Board.findById(obj.board).select("name background workspace").populate("workspace", "name");
            })
        );

        return res.status(200).json({message:"Starred boards fetched successfully.",starredBoards})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}

export const getSharedBoards = async (req,res)=>{
    try {
        const userId = req.user.id ;

        const boards = await Board.find({ members: userId }).select('name background workspace')
            .populate({
                path: 'workspace',
                select: 'members name', 
            }).sort({createdAt:-1});

        const sharedBoards = boards.filter(board => {
            const workspaceMembers = board.workspace?.members || [];
            return !workspaceMembers.includes(userId);
        });

        return res.status(200).json({message: "Shared boards fetched successfully.",sharedBoards});
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}

export const allJoinedWorkspacesAndBoards = async(req,res)=>{
    try {
        const userId = req.user.id;

        const workspaces = await Workspace.find({
        $or:[
            { createdBy:userId },
            { members:userId }
        ]
        }).select('_id name').lean().sort({createdAt:-1})

        const workspacesWithBoards = await Promise.all(
            workspaces.map(async (workspace) => {
                const boards = await Board.find({ workspace:workspace._id }).select('_id name background').lean();

                return {...workspace,boards,};
            })
        );

        return res.status(200).json({message:'Workspaces with boards fetched successfully.',
        workspaces: workspacesWithBoards,
        });
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}

export const deleteBoard = async (req,res)=>{
    try {
        const {boardId} = req.params;

        if (!req.isBoardAdmin && !req.isWorkspaceAdmin) {
            return res.status(403).json({ error: "You don't have permission to delete this board." });
        } 

        const board = await Board.findById(boardId);
        const boardName = board.name;
        await board.populate('workspace');
        const workspace = board.workspace;

        const lists = await List.find({ board: boardId });
        const listIds = lists.map(list => list._id);

        await Card.deleteMany({ list: { $in: listIds } });
        await List.deleteMany({ board: boardId });
        await StarredBoard.deleteMany({ board: boardId });
        await Notification.deleteMany({ boardId: boardId, isRead: false });

        await Board.findByIdAndDelete(boardId);

        const userId = req.user.id ;
        await Activity.create({
            workspace:workspace._id,
            user:userId,
            type:'board_deleted',
            data:{
                board_name:boardName,
                workspace_name:workspace.name,
            },
            createdAt: new Date()
        })

        return res.status(200).json({message:`Board is deleted successfully.`})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const changeVisibility = async (req,res)=>{
    try {
        const {boardId} = req.params;
        let {newVisibility} = req.body

        if (!req.isWorkspaceAdmin && !req.isBoardAdmin) {
            return res.status(403).json({ error: "You don't have permission to edit this board." });
        }

        newVisibility = newVisibility.trim();
        if(newVisibility!=='Private' && newVisibility!=='Public' && newVisibility!=='Workspace'){
            return res.status(403).json({error:`${newVisibility} visibility doesn't exist`});
        }

        const board = await Board.findById(boardId).select("name workspace admin members visibility").populate("admin",'name')
        .populate({path: "workspace",select: "name members createdBy"});
        if(!board){
            return res.status(404).json({error:"Board doesn't exist."})
        }

        const prevVisibility = board.visibility;
        board.visibility = newVisibility
        await board.save() ;

        await Activity.create({
            workspace:board.workspace._id,
            board:board._id,
            user:req.user.id,
            type:'board_visibility_updated',
            data:{
                prevVisibility,
                newVisibility:board.visibility,
                board_name:board.name,
            },
            createdAt: new Date()
        })

        return res.status(200).json({message:"Board visibility updated successfully.",board})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const getBoardActivies= async (req,res)=>{
    try {
        const {boardId} = req.params;
        
        const board = await Board.findById(boardId);
        if(!board){
            return res.status(400).json({error:"Board not found."})
        }

        const boardActivities = await Activity.find({board:board._id})
        .select("board card user type data createdAt").populate("user",'_id name')

        const activities = boardActivities.sort((a, b) => b.createdAt - a.createdAt);

        return res.status(200).json({message:"Board activities fetched succssfully.",activities})
    } catch (error) {
        console.log("Error in fetching board activities - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}


export const joinMemberInBoard = async (req,res)=>{
    try {
        const {boardId} = req.params;
        const user = req.user;

        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to edit this board." });
        }
        if(req.isBoardAdmin || req.isWorkspaceAdmin) return res.status(400).json({error:"User is already a member."});
         
        const board = await Board.findById(boardId)
        const alreadyMember = board.members.some(id => id.toString() === (user.id).toString());
        if(alreadyMember) return res.status(400).json({error:"User is already a member."});

        board.members.push(user.id);
        await board.save();

        return res.status(200).json({message:"User is added successfully."});
    } catch (error) {
        console.log("Error in joining board - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}

export const fetchBoardMembers = async (req,res)=>{
    try {
        const {boardId} = req.params 

        const board = await Board.findById(boardId)

        await board.populate("admin members","name");

        return res.status(200).json({message:"Board members fetched successfully.",
            members:board.members,admin:board.admin,currentUser:req.user
        })
    } catch (error) {
        return res.status(500).json({error:"Internal server error."});
    }
}

export const addNewMembers = async (req,res)=>{
    try {
        const {boardId} = req.params;
        const {selectedUsers} = req.body;

        if(!selectedUsers) return res.status(400).json({error:"Users are not selected."})
        
        if (!req.isWorkspaceAdmin && !req.isBoardAdmin) {
            return res.status(403).json({ error: "You don't have permission to edit this board." });
        }
         
        const board = await Board.findById(boardId).populate({ path: "workspace", select: "createdBy" });
        const workspaceAdminId = board.workspace.createdBy?.toString();
        const boardAdminId = board.admin?.toString();
        
        selectedUsers?.forEach((userId) => {
            if(!board.members?.some(id => id?.toString()===userId) && workspaceAdminId!==userId && boardAdminId !==userId ){
                board.members.push(userId);
            }
        });
        await board.save();

        return res.status(200).json({message:"User is added successfully."});
    } catch (error) {
        return res.status(500).json({error:"Internal server error."});
    }
}


export const removeBoardMember = async (req,res)=>{
    try {
        const {boardId} = req.params
        const {userId} = req.body

        if (!req.isWorkspaceAdmin && !req.isBoardAdmin) {
            return res.status(403).json({ error: "You don't have permission to edit this board." });
        }

        const board = await Board.findById(boardId);
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error:"user not found."})
        }

        // remove from cards also
        const lists = await List.find({ board: boardId }).select('_id');
        const listIds = lists.map(list => list._id);
        await Card.updateMany(
            { list: { $in: listIds } },
            { $pull: { members: userId } }
        );

        board.members = board.members.filter(memberId => memberId.toString() !== userId);
        await board.save();

        await board.populate("members", "name _id");

        return res.status(200).json({message:"User removed successfully.",members:board.members})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const leaveBoard = async (req,res)=>{
    try {
        const {boardId} = req.params
        const userId = req.user.id

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error:"user not found."})
        }

        const board = await Board.findById(boardId);
        const isMember = board.members?.some((id) => id?.toString() === userId?.toString());
        if (!isMember) {
            return res.status(400).json({ error: "User is not a member of this board." });
        }

        // remove from cards also
        const lists = await List.find({ board: boardId }).select('_id');
        const listIds = lists.map(list => list._id);
        await Card.updateMany(
            { list: { $in: listIds } },
            { $pull: { members: userId } }
        );

        board.members = board.members.filter((id) => id.toString() !== userId);
        await board.save();

        await board.populate("members", "name _id");

        return res.status(200).json({message:"User left board successfully.",members:board.members})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const renameBoard = async (req,res)=>{
    try {
        const {boardId} = req.params
        const {newName} = req.body

        if(newName.trim()==="") return res.status(404).json({error:"Board new name is required."})

        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to edit this board." });
        }

        const board = await Board.findById(boardId);
        const prevName = board.name;
        board.name = newName.trim();
        await board.save()

        await Activity.create({
            workspace:board.workspace,
            board:boardId,
            user:req.user.id,
            type:'board_rename',
            data:{
                board_oldName:prevName,
                boardId:board._id,
                board_newName:newName.trim(),
            },
            createdAt: new Date()
        })

        return res.status(200).json({message:"Board renamed successfully."});
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const changeBoardBackground = async (req,res)=>{
    try {
        const {boardId} = req.params
        const {newBackground} = req.body;
        if (!newBackground || newBackground.trim() === "") {
            return res.status(400).json({ error: "New background is not selected." });
        }
        const isHexColor = /^#([0-9A-F]{3}){1,2}$/i.test(newBackground);
        const isGradient = /^linear-gradient\([\s\S]+?\)$/i.test(newBackground);
        if (!isHexColor && !isGradient) {
        return res.status(400).json({ error: "Invalid background format." });
        }

        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to perform this action." });
        }

        const board = await Board.findById(boardId);
        board.background = newBackground
        await board.save();

        return res.status(200).json({message:"Board background changed successfully."});
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." })
    }
}