import Board from "../models/board.js";



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





