
import Workspace from '../models/workspace.js';
import Board from '../models/board.js';
import List from '../models/list.js';
import Card from '../models/card.js';
import StarredBoard from '../models/starredBoard.js';

export const createWorkspace = async (req,res)=>{
    try {
        const {name,description} = req.body ;

        if(name.trim()===''){
            return res.status(400).json({error:"All fields are required to create a workspace."})
        }

        const workspace = await Workspace.create({
            name,
            description,
            createdBy:req.user.id
        });

        return res.status(200).json({message:"Workspace is created.",workspace})
    } catch (error) {
        console.log("Error while creating workspace - ",error);
        return res.status(500).json({message:"Internal server error."})
    }
}


export const fetchWorkspaces = async (req,res)=>{
    try {
        const userId = req.user.id ;
        
        const workspaces = await Workspace.find({createdBy:userId}).sort({createdAt:-1});

        return res.status(200).json({message:"Workspaces fetched successfully.",workspaces});
    } catch (error) {
        console.log("Error while fetching workspaces - ",error);
        return res.status(500).json({error:"Internal server error."});
    }
}


export const getWorkspaceData = async (req,res)=>{
    try {
        const workspaceId = req.params.id;

        const workspace = await Workspace.findById(workspaceId).select('name description');

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

