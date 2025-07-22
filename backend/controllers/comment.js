import Card from "../models/card.js";
import Comment from "../models/Comment.js";


export const postCommentReply = async (req,res)=>{
    try {
        const {cardId,commentId} = req.params;
        const {replyContent} = req.body ;

        if (!req.canEdit) {
            return res.status(403).json({ error: "You don't have permission to perform this action." });
        }

        if (!replyContent || replyContent.trim()==="") {
            return res.status(400).json({error:"Comment content is not provided."});
        }

        const comment = await Comment.findById(commentId);
        if(!comment) return res.status(404).json({error:"Comment not found."})

        const card = await Card.findById(cardId)
        await card.populate({
            path: 'list',
            populate: {
                path: 'board',
                populate: {
                path: 'workspace'
                }
            }
        });
        const board = card.list.board;
        const workspace = board.workspace;
        
        const commentReply = await Comment.create({
            workspace: workspace._id,
            board: board._id,
            card: card._id,
            sender: req.user.id,
            receiver: comment.sender,
            content: replyContent.trim(),
            parentComment:comment._id
        });

        return res.status(200).json({message:"Comment reply posted successfully."})
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." })
    }
}

