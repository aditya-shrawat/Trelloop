import List from "../models/list.js";



export const creatingNewList = async (req,res)=>{
    try {
        const {boardId} = req.params;
        const {listName} = req.body;

        if(listName.trim()===""){
            return res.status(400).json({error:"List name is required."})
        }

        const list = await List.create({
            name:listName,
            board:boardId
        });

        return res.status(200).json({message:"List created successfully.",list})
    } catch (error) {
        console.log("Error while creating list - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}


export const fetchAllLists = async (req,res)=>{
    try {
        const {id} = req.params ;

        const lists = await List.find({board:id}).select("name ")

        return res.status(200).json({message:"Lists fetched successfully.",lists})
    } catch (error) {
        console.log("Error while fetching list - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}




