
import Workspace from '../models/workspace.js';


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
        
        const workspaces = await Workspace.find({createdBy:userId});

        return res.status(200).json({message:"Workspaces fetched successfully.",workspaces});
    } catch (error) {
        console.log("Error while fetching workspaces - ",error);
        return res.status(500).json({error:"Internal server error."});
    }
}


