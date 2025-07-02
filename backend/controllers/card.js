import Activity from "../models/Activity.js";
import Card from "../models/card.js";
import List from "../models/list.js";


const populateWorkspaceInList = async (listId)=>{
    const list = await List.findById(listId)
    if(!list){
        throw new Error("ListNotFound");
    }

    await list.populate({
        path: 'board',
        populate: {
            path: 'workspace',
            select: '_id name'
        }
    });

    return list;
}

export const creatingNewCard = async (req,res)=>{
    try {
        const {listId} = req.params ;
        const {cardName} = req.body ;
        
        if(cardName.trim()===''){
            return res.status(400).json({error:"Card name is required."})
        }

        const list = await populateWorkspaceInList(listId); // list contains workspace info
        if (!list?.board?.workspace?._id) {
            return res.status(400).json({ error: "Workspace or board not found." });
        }
        const workspaceId = list.board.workspace._id ;

        const card = await Card.create({
            name:cardName,
            list:listId,
            createdBy:req.user.id,
        })

        await Activity.create({
            workspace:workspaceId,
            board:list.board,
            card:card._id,
            user:req.user.id,
            type:'card_created',
            data:{
                card_name:card.name,
                list_name:list.name,
            },
            createdAt: new Date()
        })

        return res.status(201).json({message:"Card is created successfully.",card})
    } catch (error) {
        if (error.message === "ListNotFound") {
            return res.status(404).json({ error: "List doesn't exist." });
        }

        console.log("Error while creating card - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}



export const fetchListCards = async (req,res)=>{
    try {
        const {listId} = req.params ;

        const list = await List.findById(listId);
        if(!list){
            return res.status(404).json({error:"List doesn't exist."})
        }

        const cards = await Card.find({list:listId}).select("name isCompleted");

        return res.status(200).json({message:"Cards fetched successfully.",cards})
    } catch (error) {
        console.log("Error while fetching cards - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}


export const fetchCardData = async (req,res)=>{
    try {
        const {cardId} = req.params;
        
        const card = await Card.findById(cardId);
        if(!card){
            return res.status(404).json({error:"Card doesn't exist."});
        }

        const list = await List.findById(card.list).select("name")
        if(!list){
            return res.status(404).json({error:"List doesn't exist."})
        }

        return res.status(200).json({message:"Card details fetched succssfully.",card,list})
    } catch (error) {
        console.log("Error while fetching card details - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}


export const fetchCardActivity = async (req,res)=>{
    try {
        const {cardId} = req.params;
        
        const card = await Card.findById(cardId);
        if (!card) {
        return res.status(404).json({ message: "Card not found." });
        }

        const cardActivities = await Activity.find({card:cardId})
        .select("user type data createdAt").populate("user",'_id name')

        const activities = cardActivities.sort((a, b) => b.createdAt - a.createdAt);

        return res.status(200).json({message:"Card activities fetched succssfully.",activities})
    } catch (error) {
        console.log("Error while fetching card activities - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}


export const updateCard = async (req,res)=>{
    try {
        const {cardId} = req.params ;
        const {name,description} = req.body ;

        if(name.trim()===''){
            return res.status(400).json({error:"Card name is required."})
        }

        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ error:"Card not found." });
        }

        const previousName = card.name;
        const previousDescription = card.description;

        if (name) card.name = name;
        if (description) card.description = description;
        await card.save();

        const nameUpdated = name && name !== previousName;
        const descriptionUpdated = description && description !== previousDescription;

        if (!nameUpdated && !descriptionUpdated) {
            return res.status(200).json({ message: "No changes were made to the card.", card });
        }

        const list = await populateWorkspaceInList(card.list); // list contains workspace info
        const workspaceId = list.board.workspace._id ;
        if (!workspaceId) {
            return res.status(400).json({ error: "Workspace not found." });
        }

        let type = "";
        let data = {};

        if (nameUpdated && descriptionUpdated) {
            type = "card_newInfo" //name and description changed
            data= {
                card_oldName : previousName,
                card_newName : card.name,
            }
        } else if (nameUpdated) {
            type = "card_renamed"
            data = {
                card_oldName : previousName,
                card_newName : card.name,
            }
        } else if (descriptionUpdated) {
            type = "card_newDesc" // description changed
            data = {
                card_name : card.name,
                card_id : card._id
            }
        }

        await Activity.create({
            workspace:workspaceId,
            board:list.board,
            card:card._id,
            user:req.user.id,
            type,
            data,
            createdAt: new Date()
        })

        return res.status(200).json({ message: "Card updated successfully.", card });
    } catch (error) {
        if (error.message === "ListNotFound") {
            return res.status(404).json({ error: "List doesn't exist." });
        }

        console.log("Error while updating card info - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}


export const updateCardStatus = async (req,res)=>{
    try {
        const {cardId} = req.params;

        const card = await Card.findById(cardId);
        if(!card){
            return res.status(404).json({message:"Card doesn't exist."})
        }

        const list = await populateWorkspaceInList(card.list); // list contains workspace info
        const workspaceId = list.board.workspace._id ;
        if (!workspaceId) {
            return res.status(400).json({ error: "Workspace not found." });
        }

        card.isCompleted = !card.isCompleted;
        await card.save();

        const activity = await Activity.create({
            workspace: workspaceId,
            board: list.board,
            card: card._id,
            user: req.user.id,
            type: "card_marked",
            data: {
                card_name: card.name,
                cardId: card._id,
                isCompleted: card.isCompleted
            },
            createdAt: new Date()
        });

        return res.status(200).json({
            message: `Card is marked as ${card.isCompleted ? "complete" : "incomplete"}.`,
            isCompleted: card.isCompleted
        });
    } catch (error) {
        if (error.message === "ListNotFound") {
            return res.status(404).json({ error: "List doesn't exist." });
        }

        return res.status(500).json({message:"Internal server error."})
    }
}


export const addAttachment = async (req,res)=>{
    try {
       const {cardId} = req.params ;
       const {link} = req.body ;

       const newAttachment = link;
       if(newAttachment.trim()===""){
        return res.status(400).json({error:"Attachment is required."})
       }
       
       const card = await Card.findById(cardId);
        if(!card){
            return res.status(404).json({message:"Card doesn't exist."})
        }

        const list = await populateWorkspaceInList(card.list); // list contains workspace info
        const workspaceId = list.board.workspace._id ;
        if (!workspaceId) {
            return res.status(400).json({ error: "Workspace not found." });
        }

       card.attachments.push(newAttachment);
       await card.save();

        const activity = await Activity.create({
            workspace: workspaceId,
            board: list.board,
            card: card._id,
            user: req.user.id,
            type: "card_attachment",
            data: {
                card_name: card.name,
                cardId: card._id,
                newAttachment,
                actionType: 'added'
            },
            createdAt: new Date()
        });

       return res.status(200).json({message:"Attachment added successfully.",cardAttachments:card.attachments})
    } catch (error) {
        if (error.message === "ListNotFound") {
            return res.status(404).json({ error: "List doesn't exist." });
        }

        return res.status(500).json({error:"Internal server error."})
    }
}


export const updateAttachment = async (req,res)=>{
    try {
        const {cardId} = req.params ;
        const {newLink,index} = req.body ;

        const newAttachment = newLink;
        if(newAttachment.trim()===""){
            return res.status(400).json({error:"Enter a attachment."})
        }

        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ error: "Card not found." });
        }

        if (index < 0 || index >= card.attachments.length) {
            return res.status(400).json({ error: "Such attachment doesn't exist." });
        }  

        const cardAttachments = card.attachments;
        const oldAttachment = cardAttachments[index];
        cardAttachments[index] = newAttachment ;
        await card.save();

        const list = await populateWorkspaceInList(card.list); // list contains workspace info
        const workspaceId = list.board.workspace._id ;
        if (!workspaceId) {
            return res.status(400).json({ error: "Workspace not found." });
        }

        const activity = await Activity.create({
            workspace: workspaceId,
            board: list.board,
            card: card._id,
            user: req.user.id,
            type: "card_attachment",
            data: {
                card_name: card.name,
                cardId: card._id,
                oldAttachment,
                newAttachment,
                actionType: 'updated'
            },
            createdAt: new Date()
        });

        return res.status(200).json({message:"Attachment updated successfully.",cardAttachments})
    } catch (error) {
        if (error.message === "ListNotFound") {
            return res.status(404).json({ error: "List doesn't exist." });
        }

        return res.status(500).json({message:"Internal server error."})
    }
}


export const deleteAttachment = async (req, res) => {
    try {
      const { cardId } = req.params;
      const { index } = req.body;
  
      const card = await Card.findById(cardId);
      if (!card) {
        return res.status(404).json({ error: "Card not found." });
      }
  
      if (index < 0 || index >= card.attachments.length) {
        return res.status(400).json({ error: "Such attachment doesn't exist." });
      }
  
      const removedAttachment = card.attachments[index];
      card.attachments.splice(index, 1);
      await card.save();

        const list = await populateWorkspaceInList(card.list); // list contains workspace info
        const workspaceId = list.board.workspace._id ;
        if (!workspaceId) {
            return res.status(400).json({ error: "Workspace not found." });
        }

        const activity = await Activity.create({
            workspace: workspaceId,
            board: list.board,
            card: card._id,
            user: req.user.id,
            type: "card_attachment",
            data: {
                card_name: card.name,
                cardId: card._id,
                removedAttachment,
                actionType: 'deleted'
            },
            createdAt: new Date()
        });
  
      return res.status(200).json({ message: "Attachment deleted successfully.",cardAttachments:card.attachments });
    } catch (error) {
        if (error.message === "ListNotFound") {
            return res.status(404).json({ error: "List doesn't exist." });
        }

        return res.status(500).json({ message: "Internal server error." });
    }
  }
