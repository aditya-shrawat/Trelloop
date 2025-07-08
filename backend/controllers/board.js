import Activity from "../models/Activity.js";
import Board from "../models/board.js";
import Card from "../models/card.js";
import List from "../models/list.js";
import StarredBoard from "../models/starredBoard.js";
import Workspace from "../models/workspace.js";



export const createBoard = async (req,res)=>{
    try {
        const {workspaceId,boardName} = req.body

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
            admin:req.user.id
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

        const boards = await Board.find({workspace:id}) ;

        return res.status(200).json({message:"Boards fetched successfully.",boards});
    } catch (error) {
        console.log("Error while fetching boards - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}

export const getBoardData = async (req,res)=>{
    try {
        const {boardId} = req.params ;

        const board = await Board.findById(boardId).select("name workspace admin members visibility").populate("admin",'name')
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
                return await Board.findById(obj.board).select("name workspace").populate("workspace", "name");
            })
        );

        return res.status(200).json({message:"Starred boards fetched successfully.",starredBoards})
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
                const boards = await Board.find({ workspace:workspace._id }).select('_id name').lean();

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

        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to edit this board." });
        }

        const board = await Board.findById(boardId);
        if(!board){
            return res.status(404).json({error:"Board doesn't exist."})
        }
        await board.populate("workspace");
        const workspace = board.workspace;

        const userId = req.user.id ;
        const isBoardAdmin = userId === board.admin?.toString()
        const isWorkspaceAdmin = workspace.createdBy?.toString() === userId
        if(!isBoardAdmin && !isWorkspaceAdmin){
            return res.status(403).json({error:"Only workspace and board admin's can delete board."})
        }

        await Activity.create({
            workspace:workspace._id,
            board:board._id,
            user:userId,
            type:'board_deleted',
            data:{
                board_name:board.name,
                workspace_name:workspace.name,
                boardId:board._id
            },
            createdAt: new Date()
        })

        const lists = await List.find({ board: boardId });
        const listIds = lists.map(list => list._id);

        await Card.deleteMany({ list: { $in: listIds } });
        await List.deleteMany({ board: boardId });

        await Board.findByIdAndDelete(boardId);

        return res.status(200).json({message:`${board.name} is deleted successfully.`})
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
        
        if (!req.isWorkspaceAdmin && !req.isBoardAdmin) {
            return res.status(403).json({ error: "You don't have permission to edit this board." });
        }
         
        const board = await Board.findById(boardId)
        
        selectedUsers.forEach((userId) => {
            if(!board.members.some(id => id.toString()===(userId).toString()) && req.isWorkspaceAdmin!==(userId).toString() && req.isBoardAdmin!==(userId).toString() ){
                board.members.push(userId);
            }
        });
        await board.save();

        return res.status(200).json({message:"User is added successfully."});
    } catch (error) {
        return res.status(500).json({error:"Internal server error."});
    }
}