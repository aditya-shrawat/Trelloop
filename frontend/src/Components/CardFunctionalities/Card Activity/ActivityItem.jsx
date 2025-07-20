import React from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


dayjs.extend(relativeTime);

const ActivityItem = ({activity})=>{
    const createdAt = dayjs(activity.createdAt);
    const now = dayjs();
    const diffInHours = now.diff(createdAt, 'hour');
    const displayTime = diffInHours < 24 ? createdAt.fromNow() : createdAt.format('MMM DD, YYYY, hh:mm A');


    const getActivityMessage =(activity)=> {
        const { type, data } = activity;

        switch (type) {
            case "card_created":
            return `added the card to list "${data.list_name}"`;

            case "card_renamed":
            return `renamed the card from "${data.card_oldName}" to "${data.card_newName}".`;

            case "card_newInfo":
            return `updated the card name "${data.card_oldName}" to "${data.card_newName}" and updated description.`;

            case "card_newDesc":
            return `updated the card description.`;

            case "card_deadline_changed":
            return `updated the card deadline.`;

            case "card_marked":
            return `marked the card as ${(data.isCompleted)?`complete`:`incomplete`}.`

            case "card_attachment":
                if(data.actionType==='added'){
                    return `added "${data.newAttachment}" to attachments.`; 
                }
                else if(data.actionType==='updated'){
                    return `updated "${data.oldAttachment}" to "${data.newAttachment}".`; 
                }
                else if(data.actionType==='deleted'){
                    return `deleted "${data.removedAttachment}" from attachments.`; 
                }
            break;

            default:
            return `performed an action.`;
        }
    }

    return (
        <div className='w-full flex '>
            <div className='h-auto w-auto mr-2'>
                <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center">
                    <span className="font-semibold text-white text-lg ">
                        {activity.user.name && activity.user.name[0].toUpperCase()}
                    </span>
                </div>
            </div>
            <div className="w-full">
                <div className='w-full text-sm text-gray-700'>
                    <span className="font-semibold mr-1">{activity.user.name}</span>{getActivityMessage(activity)}
                </div>
                <p className="text-xs text-gray-500">
                    {displayTime}
                </p>
            </div>
        </div>
    )
}


export default ActivityItem