import Activity from "../models/Activity.js";
import Board from "../models/board.js";
import StarredBoard from "../models/starredBoard.js";
import Workspace from "../models/workspace.js";



export const createBoard = async (req,res)=>{
    try {
        const {workspaceId,boardName} = req.body

        if(!workspaceId || !boardName){
            return res.status(400).json({error:"All fields are required!"})
        }

        const workspace = await Workspace.findById(workspaceId);
        if(!workspace){
            return res.status(404).json({error:"Workspace not found."})
        }

        const board = await Board.create({
            name:boardName,
            workspace:workspace._id
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
        const {id} = req.params ;

        const board = await Board.findById(id).select("name workspace");
        const workspace = await Workspace.findById(board.workspace).select("name description")

        return res.status(200).json({message:"Board data fetched successfully.",board,workspace})
    } catch (error) {
        console.log("Error in fetching board data - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}


export const getBoardStarStatus = async (req,res)=>{
    try {
        const {id} = req.params
        const userId = req.user.id;

        const existingStarredBoard = await StarredBoard.findOne({board:id,user:userId });

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
        const {id} = req.params
        const userId = req.user.id;

        const existingStarredBoard = await StarredBoard.findOne({board:id,user:userId });

        if (existingStarredBoard) {
            await StarredBoard.findOneAndDelete({_id:existingStarredBoard._id });
            return res.status(200).json({message:"Board unstarred.",starStatus:false});
        } else {
            const newStar = new StarredBoard({board:id,user:userId});
            await newStar.save();
            return res.status(200).json({message:"Board starred.",starStatus:true });
        }
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const getStarredBoards = async (req,res)=>{
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "User is not authenticated." });
        }
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

export const getWorkspaceInfoByBoard = async (req,res)=>{
    try {
        const {id} = req.params;

        const board = await Board.findById(id);
        if(!board){
            return res.status(403).json({error:"Board does not exist."})
        }

        const workspace = await Workspace.findById(board.workspace).select('_id name');
         
        return res.status(200).json({message:"workspace info fetched.",workspace})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal server error."})
    }
}
