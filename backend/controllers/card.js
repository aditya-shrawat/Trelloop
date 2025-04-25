import Card from "../models/card.js";


export const creatingNewCard = async (req,res)=>{
    try {
        const {listId} = req.params ;
        const {cardName} = req.body ;
        
        if(cardName.trim()===''){
            return res.status(400).json({error:"Card name is required."})
        }

        const card = await Card.create({
            name:cardName,
            list:listId
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






