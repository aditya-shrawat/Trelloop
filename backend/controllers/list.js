import Activity from "../models/Activity.js";
import Board from "../models/board.js";
import List from "../models/list.js";



export const creatingNewList = async (req,res)=>{
    try {
        const {boardId} = req.params;
        const {listName} = req.body;

        if(listName.trim()===""){
            return res.status(400).json({error:"List name is required."})
        }

        const board = await Board.findById(boardId);
        if(!board){
            return res.status(404).json({error:'Board not found.'})
        }
        await board.populate("workspace")

        const list = await List.create({
            name:listName,
            board:board._id
        });

        await Activity.create({
            workspace:board.workspace._id,
            board:board._id,
            user:req.user.id,
            type:'list_created',
            data:{
                board_name:board.name,
                list_name:list.name,
                boardId:board._id
            },
            createdAt: new Date()
        })

        return res.status(200).json({message:"List created successfully.",list})
    } catch (error) {
        console.log("Error while creating list - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}


export const fetchAllLists = async (req,res)=>{
    try {
        const {boardId} = req.params ;

        const board = await Board.findById(boardId);
        if(!board){
            return res.status(404).json({error:"Board not found."})
        }
        
        const lists = await List.find({board:boardId}).select("name ")

        return res.status(200).json({message:"Lists fetched successfully.",lists})
    } catch (error) {
        console.log("Error while fetching list - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}




