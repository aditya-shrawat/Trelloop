import Comment from "../models/Comment.js";


export const getMainFeed = async (req,res)=>{
    try {
        const userId = req.user.id;

        const receivedComments = await Comment.find({ receiver: userId }).populate([
            { path: 'workspace', select: 'name' },
            { path: 'board', select: 'name' },
            { path: 'card', select: 'name' },
            { path: 'sender', select: 'name' }
        ]);

        return res.status(200).json({message:"Home feed fetched successfully.",receivedComments})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}
