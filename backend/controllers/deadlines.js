import Board from "../models/board.js";
import Card from "../models/card.js";
import List from "../models/list.js";


export const getAllDeadlines = async (req,res)=>{
    try {
        const userId = req.user._id;

        const boardIds = await Board.find({ admin: userId }).distinct('_id');

        const listIds = await List.find({ board: { $in: boardIds } }).distinct('_id');

        const ownCardIds = await Card.find({ list: { $in: listIds } }).distinct('_id');
        const memberedCardIds = await Card.find({ members: userId }).distinct('_id');

        const allCardIds  = [...ownCardIds,...memberedCardIds];
        const uniqueCardIds = [...new Set(allCardIds)];

        const cardsDeadlinesDetails = await Card.find({ _id: { $in: uniqueCardIds } })
            .select("name deadline isCompleted");

        return res.status(200).json({message:"Deadlines fetched successfully.",cardsDeadlinesDetails})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


