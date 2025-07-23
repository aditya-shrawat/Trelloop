import Board from "../models/board.js";
import Comment from "../models/Comment.js";


export const getMainFeed = async (req,res)=>{
    try {
        const userId = req.user.id;

        const joinedBoards = await Board.find(
            {
            $or: [{ members: userId }, { admin: userId }]
            }
        )
        .select('_id') || [] ;

        const allCommentArrays = await Promise.all(
            joinedBoards.map(async (board) => {
                return await Comment.find({ board: board._id }).populate([
                    { path: 'workspace', select: 'name' },
                    { path: 'board', select: 'name background' },
                    { path: 'card', select: 'name deadline' },
                    { path: 'sender', select: 'name' },
                    { path: 'replyTo', select: 'name' }
                ]);
            })
        );
        const allComments = allCommentArrays.flat().sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return res.status(200).json({message:"Home feed fetched successfully.",allComments})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}
