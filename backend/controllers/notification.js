import notification from "../models/notification.js";


export const fetchNotifications = async (req,res)=>{
    try {
        const user = req.user ;

        const notifications = await notification.find({userId:user.id}).populate('senderId','name');

        return res.status(200).json({message:"Notificatons fetched successfully.",notifications})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const countUnreadNotification = async (req,res)=>{
    try {
        const user = req.user ;

        const notifCount = await notification.countDocuments({userId:user.id,isRead:false})

        return res.status(200).json({message:"Notifications counted successfully.",notifCount})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}

