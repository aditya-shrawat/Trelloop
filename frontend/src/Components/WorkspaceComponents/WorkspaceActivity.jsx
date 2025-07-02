import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useParams } from 'react-router-dom';

dayjs.extend(relativeTime);

const WorkspaceActivity = () => {
    const [activities,setActivities] = useState([])
    const [loadingActivities,setLoadingActivities] = useState(true)
    const { id, name } = useParams();

    const fetchWorkspaceActivities = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/workspace/${id}/activities`,
            {withCredentials: true}
            );

            setActivities(response.data.activities)
            setLoadingActivities(false)
        } catch (error) {
            console.log("Error while fetching workspace activities - ",error)
        }
    }

    useEffect(()=>{
        if(id && name){
            fetchWorkspaceActivities()
        }
    },[id,name])

  return (
    <div className="w-full h-auto ">
        <div className="pb-6 mb-4 border-b-[1px] border-gray-300 ">
          <h2 className="text-xl font-semibold text-gray-700">Workspace activity</h2>
          <h2 className="text-base text-gray-500 ">
            Track all recent activities across your workspace.
          </h2>
        </div>
        <div className="w-full h-auto space-y-4 ">
            { (loadingActivities) ?
                <div>Loading workspace activities...</div> :
                (activities.length !==0)?
                (activities.map((activity)=>(
                    <WorkspaceActivityItem key={activity._id} activity={activity}  />
                ))):
                (
                <div>No activity</div>
                )
            }
        </div>
    </div>
  )
}

export default WorkspaceActivity


const WorkspaceActivityItem = ({activity})=>{
    const createdAt = dayjs(activity.createdAt);
    const now = dayjs();
    const diffInHours = now.diff(createdAt, 'hour');
    const displayTime = diffInHours < 24 ? createdAt.fromNow() : createdAt.format('MMM DD, YYYY, hh:mm A');


    const getActivityMessage =(activity)=> {
        const { type, data,card,board } = activity;

        switch (type) {
            case "board_created":
            return <>created <a href={`/board/${(data.board_name).replace(/\s+/g, '')}/${data.boardId}`} className="common-a-tag-css">{data.board_name}</a> board to this workspace.</>;

            case "list_created":
            return <>added "{data.list_name}" list to <a href={`/board/${(data.board_name).replace(/\s+/g, '')}/${data.boardId}`} className="common-a-tag-css">{data.board_name}</a> board.</>;

            case "card_created":
            return <>added the card <a href={`/card/${(data.card_name).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_name}</a> card to the list "{data.list_name}".</>;

            case "card_renamed":
            return <>renamed the card from "{data.card_oldName}" to <a href={`/card/${(data.card_newName).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_newName}</a>.</>;

            case "card_newInfo":
            return <>updated the card name "{data.card_oldName}" to <a href={`/card/${(data.card_newName).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_newName}</a> and updated description.</>;

            case "card_newDesc":
            return <>updated <a href={`/card/${(data.card_name).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_name}</a> card description.</>;

            case "card_marked":
            return <>marked <a href={`/card/${(data.card_name).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_name}</a> as {(data.isCompleted)?"complete":"incomplete"}.</>

            case "card_attachment":
                if(data.actionType==='added'){
                    return <>attached <a href={data.newAttachment} className="common-a-tag-css" target="_blank" rel="noopener noreferrer">{data.newAttachment}</a> to <a href={`/card/${(data.card_name).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_name}</a> card.</>; 
                }
                else if(data.actionType==='updated'){
                    return <>updated attachment <a href={data.oldAttachment} className="common-a-tag-css" target="_blank" rel="noopener noreferrer">{data.oldAttachment}</a> to <a href={data.newAttachment} className="common-a-tag-css" target="_blank" rel="noopener noreferrer">{data.newAttachment}</a> on <a href={`/card/${(data.card_name).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_name}</a> card.</>; 
                }
                else if(data.actionType==='deleted'){
                    return <>deleted attachment <a href={data.removedAttachment} className="common-a-tag-css" target="_blank" rel="noopener noreferrer">{data.removedAttachment}</a> from <a href={`/card/${(data.card_name).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_name}</a> card.</>; 
                }
                else {
                    return <>performed attachment action on <a href={`/card/${(data.card_name).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_name}</a> card.</>;
                }

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