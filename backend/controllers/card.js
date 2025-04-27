import Card from "../models/card.js";
import List from "../models/list.js";


export const creatingNewCard = async (req,res)=>{
    try {
        const {listId} = req.params ;
        const {cardName} = req.body ;
        
        if(cardName.trim()===''){
            return res.status(400).json({error:"Card name is required."})
        }

        const list = await List.findById(listId).select("name")
        const activity = {
            user:req.user.id,
            message:`created this card to ${list.name}`,
            createdAt: new Date()
        }

        const card = await Card.create({
            name:cardName,
            list:listId,
            createdBy:req.user.id,
            activities: [activity]
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

        const cards = await Card.find({list:listId});

        return res.status(200).json({message:"Cards fetched successfully.",cards})
    } catch (error) {
        console.log("Error while fetching cards - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}


export const fetchCardData = async (req,res)=>{
    try {
        const {cardId} = req.params;
        
        const card = await Card.findById(cardId).select("name description list createdBy ");

        const list = await List.findById(card.list).select("name ");

        return res.status(200).json({message:"Card details fetched succssfully.",card,list})
    } catch (error) {
        console.log("Error while fetching card details - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}


export const fetchCardActivity = async (req,res)=>{
    try {
        const {cardId} = req.params;
        
        const card = await Card.findById(cardId)
        .select("activities")
        .populate("activities.user", "name ");

        if (!card) {
        return res.status(404).json({ message: "Card not found." });
        }

        const sortedActivities = card.activities.sort((a, b) => b.createdAt - a.createdAt);

        const activities = sortedActivities.map(activity => ({
        user: {
            _id: activity.user._id,
            name: activity.user.name,
        },
        message: activity.message,
        createdAt: activity.createdAt
        }));

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

        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ error:"Card not found." });
        }

        if (name) card.name = name;
        if (description) card.description = description;

        const activity = {
            user: req.user.id,
            message: "updated card information.",
            createdAt: new Date(),
        };
        card.activities.push(activity);

        await card.save();

        return res.status(200).json({ message: "Card updated successfully.", card });
    } catch (error) {
        console.log("Error while updating card info - ",error)
        return res.status(500).json({error:"Internal server error."})
    }
}




