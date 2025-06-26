import Notification from "../models/notification.js";


export const fetchNotifications = async (req,res)=>{
    try {
        const user = req.user ;

        const notifications = await Notification.find({userId:user.id,isRead:false}).populate('senderId','name').sort({createdAt:-1});

        return res.status(200).json({message:"Notificatons fetched successfully.",notifications})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const countUnreadNotification = async (req,res)=>{
    try {
        const user = req.user ;

        const notifCount = await Notification.countDocuments({userId:user.id,isRead:false})

        return res.status(200).json({message:"Notifications counted successfully.",notifCount})
    } catch (error) {
        return res.status(500).json({error:"Internal server error."})
    }
}


export const markAsRead = async (req,res)=>{
    try {
        const {notificationId} = req.params;
        const isRead = req.body.isRead ?? true;

        const notification = await Notification.findById(notificationId);

        if(!notification) return res.status(404).json({error:"Notification not found."})

        notification.isRead = isRead;
        await notification.save();

        return res.status(200).json({message:"Notification marked as read."})
    } catch (error) {
        console.error("Error in markAsRead:", error);
        return res.status(500).json({error:"Internal server error."})
    }
}
