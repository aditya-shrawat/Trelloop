import Board from "../models/board.js";
import StarredBoard from "../models/starredBoard.js";
import Workspace from "../models/workspace.js";



export const createBoard = async (req,res)=>{
    try {
        const {workspaceId,boardName} = req.body

        if(!workspaceId || !boardName){
            return res.status(400).json({error:"All fields are required!"})
        }

        const board = await Board.create({
            name:boardName,
            workspace:workspaceId
        });

        return res.status(200).json({message:"Board created successfully.",board})
    } catch (error) {
        console.log("Error while creating board - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}

export const fetcheBoards = async (req,res)=>{
    try {
        const {workspaceId} = req.params

        const boards = await Board.find({workspace:workspaceId}) ;

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

