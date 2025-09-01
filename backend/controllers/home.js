import Board from "../models/board.js";
import Comment from "../models/Comment.js";


export const getMainFeed = async (req,res)=>{
    try {
        const userId = req.user._id;

        const boardIds = await Board.find(
            {$or: [{ members: userId }, { admin: userId }]}
        ).distinct('_id') || [] ;

        const allComments = await Comment.find({ board: { $in: boardIds } }).populate([
            { path: "workspace", select: "name" },
            { path: "board", select: "name background" },
            { path: "card", select: "name deadline" },
            { path: "sender", select: "firstName lastName userName profileImage" },
            { path: "replyTo", select: "firstName lastName userName profileImage" },
        ]);

        allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.status(200).json({message:"Home feed fetched successfully.",allComments})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}
