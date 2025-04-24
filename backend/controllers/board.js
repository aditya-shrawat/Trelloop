import Board from "../models/board.js";
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





