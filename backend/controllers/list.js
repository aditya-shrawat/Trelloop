import Activity from "../models/Activity.js";
import Board from "../models/board.js";
import Card from "../models/card.js";
import List from "../models/list.js";



export const creatingNewList = async (req,res)=>{
    try {
        const {boardId} = req.params;
        const {listName} = req.body;

        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to edit this board." });
        }

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


export const updateList = async (req,res)=>{
    try {
        const {listId,boardId} = req.params;
        const {newListName} = req.body;

        if (!newListName || newListName.trim() === "") {
            return res.status(400).json({ error: "List name is required." });
        }

        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to edit this list." });
        }

        const list = await List.findById(listId);
        if(!list) return res.status(404).json({error:"List not found."})
        const board = await Board.findById(boardId)

        const listPrevName = list.name;
        list.name = newListName.trim();
        await list.save();

        const userId = req.user.id ;
        await Activity.create({
            workspace:board.workspace,
            board:boardId,
            user:userId,
            type:'list_updated',
            data:{
                list_newName:newListName.trim(),
                list_oldName:listPrevName,
                board_name:board.name,
                boardId:boardId
            },
            createdAt: new Date()
        })

        return res.status(200).json({message:"List updated successfully.",list})
    } catch (error) {
        console.log("Error while updating list - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}


export const deleteList = async (req,res)=>{
    try {
        const {listId,boardId} = req.params;

        if (!req.isBoardAdmin && !req.isWorkspaceAdmin) {
            return res.status(403).json({ error: "You don't have permission to delete this list." });
        }

        const list = await List.findById(listId);
        if(!list){
            return res.status(404).json({error:"List not found."})
        }
        const board = await Board.findById(boardId);
        const listName = list.name;

        await Card.deleteMany({ list: listId });
        await List.findByIdAndDelete(listId);

        const userId = req.user.id ;
        await Activity.create({
            workspace:board.workspace,
            board:boardId,
            user:userId,
            type:'list_deleted',
            data:{
                list_name:listName,
                board_name:board.name,
                boardId:boardId
            },
            createdAt: new Date()
        })

        return res.status(200).json({message:"List deleted successfully."})
    } catch (error) {
        console.log("Error while deleteing list - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}

