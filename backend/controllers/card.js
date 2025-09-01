import Activity from "../models/Activity.js";
import Board from "../models/board.js";
import Card from "../models/card.js";
import Comment from "../models/Comment.js";
import List from "../models/list.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";


export const creatingNewCard = async (req,res)=>{
    try {
        const {listId} = req.params ;
        const {cardName} = req.body ;

        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to edit this card." });
        }
        
        if(cardName.trim()===''){
            return res.status(400).json({error:"Card name is required."})
        }

        const list = await List.findById(listId)
        if(!list){
            return res.status(404).json({error:"list doesn't exist."})
        }

        await list.populate({
            path: 'board',
            populate: {
                path: 'workspace',
                select: '_id name'
            }
        });
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

        const cards = await Card.find({list:listId}).select("name isCompleted deadline cover");

        return res.status(200).json({message:"Cards fetched successfully.",cards})
    } catch (error) {
        console.log("Error while fetching cards - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}


export const fetchCardData = async (req,res)=>{
    try {
        const {cardId} = req.params;
        
        const card = req.card;
        await card.populate({ path: 'members', select: 'firstName lastName username profileImage' });
        const list = await List.findById(card.list).select('name board');

        const board = await Board.findById(list.board).select("name workspace admin members visibility").populate("admin",'firstName lastName username profileImage')
        .populate({path: "workspace",select: "name members createdBy"});
        if(!board){
            return res.status(404).json({error:"Board doesn't exist."})
        }

        return res.status(200).json({message:"Card details fetched succssfully.",card,list,board})
    } catch (error) {
        console.log("Error while fetching card details - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}


export const fetchCardActivity = async (req,res)=>{
    try {
        const card = req.card;

        const activities = await Activity.find({card:card._id})
        .select("user type data createdAt").populate("user",'_id firstName lastName profileImage').sort({ createdAt: -1 }).lean();

        const comments = await Comment.find({ card: card._id }).select('card sender receiver content createdAt parentComment').populate([
            { path: 'card', select: 'name' },
            { path: 'sender', select: 'firstName lastName username profileImage' },
            { path: 'replyTo', select: 'firstName lastName username profileImage' }
        ]).sort({ createdAt: -1 }).lean();

        const taggedActivities = activities.map(act => ({ ...act, _type: 'activity' }));
        const taggedComments = comments.map(com => ({ ...com, _type: 'comment' }));

        const allActivities = [...taggedActivities, ...taggedComments].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return res.status(200).json({message:"Card activities fetched succssfully.",allActivities})
    } catch (error) {
        console.log("Error while fetching card activities - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}


export const updateCard = async (req,res)=>{
    try {
        const {cardId} = req.params ;
        const {name,description} = req.body ;

        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to edit this card." });
        }

        if(name.trim()===''){
            return res.status(400).json({error:"Card name is required."})
        }

        const card = req.card;

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

        const list = req.list;
        await list.populate({
            path: 'board',
            populate: {
                path: 'workspace',
                select: '_id name'
            }
        });
        const workspaceId = list.board.workspace._id ;

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
        console.log("Error while updating card info - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}


export const updateCardStatus = async (req,res)=>{
    try {
        const {cardId} = req.params;

        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to edit this card." });
        }

        const card = req.card;

        const list = req.list;
        await list.populate({
            path: 'board',
            populate: {
                path: 'workspace',
                select: '_id name'
            }
        });
        const workspaceId = list.board.workspace._id ;

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
        return res.status(500).json({message:"Internal server error."})
    }
}


export const addAttachment = async (req,res)=>{
    try {
       const {cardId} = req.params ;
       const {link} = req.body ;

       if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to edit this card." });
       }

       const newAttachment = link;
       if(newAttachment.trim()===""){
        return res.status(400).json({error:"Attachment is required."})
       }
       
       const card = req.card;

        const list = req.list;
        await list.populate({
            path: 'board',
            populate: {
                path: 'workspace',
                select: '_id name'
            }
        });
        const workspaceId = list.board.workspace._id ;

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
        return res.status(500).json({error:"Internal server error."})
    }
}


export const updateAttachment = async (req,res)=>{
    try {
        const {cardId} = req.params ;
        const {newLink,index} = req.body ;

        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to edit this card." });
        }

        const newAttachment = newLink;
        if(newAttachment.trim()===""){
            return res.status(400).json({error:"Enter a attachment."})
        }

        const card = req.card;

        if (index < 0 || index >= card.attachments.length) {
            return res.status(400).json({ error: "Such attachment doesn't exist." });
        }  

        const cardAttachments = card.attachments;
        const oldAttachment = cardAttachments[index];
        cardAttachments[index] = newAttachment ;
        await card.save();

        const list = req.list;
        await list.populate({
            path: 'board',
            populate: {
                path: 'workspace',
                select: '_id name'
            }
        });
        const workspaceId = list.board.workspace._id ;

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
        return res.status(500).json({message:"Internal server error."})
    }
}


export const deleteAttachment = async (req, res) => {
    try {
      const { cardId } = req.params;
      const { index } = req.body;

      if (!req.canEdit) {
        return res.status(403).json({ error: "You don't have permission to edit this card." });
      }
  
      const card = req.card ;
  
      if (index < 0 || index >= card.attachments.length) {
        return res.status(400).json({ error: "Such attachment doesn't exist." });
      }
  
      const removedAttachment = card.attachments[index];
      card.attachments.splice(index, 1);
      await card.save();

        const list = req.list;
        await list.populate({
            path: 'board',
            populate: {
                path: 'workspace',
                select: '_id name'
            }
        });
        const workspaceId = list.board.workspace._id ;

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
        return res.status(500).json({ message: "Internal server error." });
    }
  }


export const deleteCard = async (req,res)=>{
    try {
        const {cardId} = req.params;

        const card = req.card
        const list = req.list;
        await list.populate({
            path: 'board',
            populate: {
                path: 'workspace',
                select: '_id name members createdBy'
            }
        });
        const board = list.board
        const workspace = board.workspace ;
        const userId = req.user._id;

        const isBoardAdmin = board.admin?.toString() === userId;
        const isWorkspaceAdmin = workspace.createdBy?.toString() === userId;

        if (!isBoardAdmin && !isWorkspaceAdmin) {
            return res.status(403).json({ error: "You don't have permission to delete this card." });
        }

        await Notification.deleteMany({ cardId: cardId, isRead: false });
        const cardName = card.name;
        await Card.findByIdAndDelete(cardId);

        await Activity.create({
            workspace: workspace._id,
            board: board._id,
            user: userId,
            type: "card_deleted",
            data: {
                card_name: cardName,
                boardId: list.board._id,
                board_name:list.board.name
            },
            createdAt: new Date()
        });

        return res.status(200).json({message:"Card deleted successfully."})
    } catch (error) {
        console.log("Error while deleteing card - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}


export const updateDeadline = async (req,res)=>{
    try {
        const {newDeadline} = req.body

        if(!newDeadline) return res.status(400).json({error:"New deadline is required."})

        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to edit this card." });
        }

        const card = req.card
        const list = req.list;
        await list.populate({
            path: 'board',
            populate: {
                path: 'workspace',
                select: '_id name '
            }
        });
        const board = list.board
        const workspace = board.workspace ;
        const userId = req.user._id;

        card.deadline = new Date(newDeadline);
        await card.save()

        await Activity.create({
            workspace: workspace._id,
            board: board._id,
            card:card._id,
            user: userId,
            type: "card_deadline_changed",
            data: {
                card_name: card.name,
                cardId:card._id,
                boardId: board._id,
                board_name:board.name
            },
            createdAt: new Date()
        });

        return res.status(200).json({message:"Card deadline changed successfully."})
    } catch (error) {
        console.log("Error while updating deadline - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}


export const addNewCardMembers = async (req,res)=>{
    try {
        const {selectedMembersIds} = req.body;
        
        if (!selectedMembersIds) {
            return res.status(400).json({ error: "New members are not selected." });
        }

        await req.list.populate({
            path: "board",
            populate: {
                path: "workspace",
                select: "createdBy",
            },
        });

        const board = req.list.board;
        const workspaceAdminId = board.workspace?.createdBy?.toString();
        const boardAdminId = board.admin?.toString();
        const requesterId = req.user.id?.toString();

        if (requesterId !== workspaceAdminId && requesterId !== boardAdminId) {
            return res.status(403).json({ error: "You don't have permission to edit this card." });
        }
         
        const card = req.card
        
        selectedMembersIds.forEach((userId) => {
            if( !card.members.some(id => id.toString()===(userId).toString()) ){
                card.members.push(userId);
            }
        });
        await card.save();

        return res.status(200).json({message:"Members are added successfully."});
    } catch (error) {
        return res.status(500).json({error:"Internal server error."});
    }
}

export const joinCard = async (req,res)=>{
    try {
        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to perform this action." });
        }
        const userId = req.user._id;

        const card = req.card ;
        const isCardMember = card.members?.some((id)=>id?.toString()=== userId?.toString());
        if(isCardMember) return res.status(400).json({error:"User is already card member."})

        const list = req.list;
        await list.populate('board');
        const board = list.board;
        const isBoardMember = board.members?.some((id)=>id?.toString()=== userId?.toString());

        // only board members can join card, if not a board member then user must get added to board 
        if(!isBoardMember){
            board.members.push(userId);
            await board.save();
        }

        card.members.push(userId);
        await card.save();

        return res.status(200).json({message:"User joined card successfully."});
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}

export const removeCardMember = async (req,res)=>{
    try {
        const {userId} = req.body;
        if(!userId) return res.status(400).json({error:"User id is not provided."})

        await req.list.populate({
            path: "board",
            populate: {
                path: "workspace",
                select: "createdBy",
            },
        });

        const board = req.list.board;
        const workspaceAdminId = board.workspace?.createdBy?.toString();
        const boardAdminId = board.admin?.toString();
        const requesterId = req.user.id?.toString();

        if (requesterId !== workspaceAdminId && requesterId !== boardAdminId) {
            return res.status(403).json({ error: "You don't have permission to edit this card." });
        }

        const card = req.card;

        card.members = (card.members)?.filter((id)=>id?.toString()!==userId?.toString());
        await card.save();

        return res.status(200).json({message:"Member removed successfully."})
    } catch (error) {
        console.log("error - ",error)
        res.status(500).json({ error: "Internal server error." })
    }
}


export const leaveCard = async (req,res)=>{
    try {
        const {userId} = req.body;
        if(!userId) return res.status(400).json({error:"User id is not provided."})

        if ( (req.user.id)?.toString() !== userId?.toString() ) {
            return res.status(403).json({ error: "You don't have permission to perform this action." });
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error:"user not found."})
        }

        const card = req.card;
        const isMember = card.members?.some((id) => id?.toString() === userId?.toString());
        if (!isMember) {
            return res.status(400).json({ error: "User is not a member of this card." });
        }

        card.members = (card.members)?.filter((id)=>id?.toString()!==userId?.toString());
        await card.save();

        return res.status(200).json({message:"Member left the card successfully."})
    } catch (error) {
        res.status(500).json({ error: "Internal server error." })
    }
}

export const changeCardCover = async (req,res)=>{
    try {
        const {newCover} = req.body;
        if (!newCover || newCover.trim() === "") {
            return res.status(400).json({ error: "New cover is not selected." });
        }
        const isHexColor = /^#[0-9A-F]{6}$/i.test(newCover);
        if (!isHexColor) return res.status(400).json({ error: "Invalid cover color format." });

        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to perform this action." });
        }

        const card = req.card;
        card.cover = newCover
        await card.save();

        return res.status(200).json({message:"Card cover changed successfully."});
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." })
    }
}

export const removeCardCover = async (req,res)=>{
    try {
        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to perform this action." });
        }

        const card = req.card;
        card.cover = null
        await card.save();

        return res.status(200).json({message:"Card cover removed successfully."});
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." })
    }
}