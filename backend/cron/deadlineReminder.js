import cron from 'node-cron';
import Card from "../models/card.js";
import Notification from "../models/notification.js";


const notificationMessage = (cardDeadline,cardName)=>{
    const deadlineDate = new Date(cardDeadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = (deadlineDate - today) / (1000 * 60 * 60 * 24);

    let message = "";
    if (diffDays === 0) {
        message = `Today is the last day to complete the card "${cardName}".`;
    } else if (diffDays === 1) {
        message = `Tomorrow is the deadline for card "${cardName}".`;
    }
    else{
        return null;
    }
    return message;
}

const startReminderScheduler = (io) => {
  cron.schedule('0 0 0 * * *', async () => {
    try {
        const start = new Date();
        start.setHours(0, 0, 0, 0); // today 

        const end = new Date();
        end.setDate(end.getDate() + 1); // tomorrow
        end.setHours(23, 59, 59, 999); // tomorrow end

        const cardsDueSoon = await Card.find({
            deadline: { $gte: start, $lte: end, $ne: null },
            isCompleted: false
        });

        for (const card of cardsDueSoon) {
            const members = card.members;

            if (!members || members.length === 0) {
                continue;
            }

            const notifMessage = notificationMessage(card.deadline,card.name)
            if(!notifMessage) {
                continue;
            }

            for (const memberId of members) {
                io.to(`user_${memberId}`).emit("new_notification", {
                    cardId:card._id,
                    type: "card_deadline",
                    message: notifMessage,
                });

                const notification = await Notification.create({
                    userId: memberId,
                    cardId: card._id,
                    type: "card_deadline",
                    message: notifMessage,
                    read: false,
                    createdAt: new Date(),
                });
            }
        }
    } catch (error) {
      console.error("Cron job error- ", error);
    }
  });
};

export default startReminderScheduler;