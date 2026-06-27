import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useApi } from '../../../api/useApi';
import CircularProgress from '@mui/material/CircularProgress';

dayjs.extend(relativeTime);

const WorkspaceActivity = () => {
    const [activities,setActivities] = useState([])
    const [loadingActivities,setLoadingActivities] = useState(true)
    const { id, name } = useParams();
    const api = useApi();

    const fetchWorkspaceActivities = async ()=>{
        try {
            const response = await api.get(`/workspace/${id}/activities`);

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
          <h2 className="text-sm text-gray-400 ">
            Track all recent activities across your workspace.
          </h2>
        </div>
        <div className="w-full h-auto space-y-4 ">
            {   (loadingActivities) ?
                    <div className="w-full text-center pt-24">
                       <CircularProgress size="30px" sx={{ color: '#059669' }} />
                    </div> 
                :
                (activities.length !==0)?
                    (activities.map((activity)=>(
                        <WorkspaceActivityItem key={activity._id} activity={activity}  />
                    )))
                :
                    (<div className="text-center text-gray-400 py-10">
                        <p className="text-lg font-medium">No activity yet!</p>
                    </div>)
            }
        </div>
    </div>
  )
}

export default WorkspaceActivity


const WorkspaceActivityItem = ({activity})=>{
    const location = useLocation();
    const createdAt = dayjs(activity.createdAt);
    const now = dayjs();
    const diffInHours = now.diff(createdAt, 'hour');
    const displayTime = diffInHours < 24 ? createdAt.fromNow() : createdAt.format('MMM DD, YYYY, hh:mm A');


    const getActivityMessage =(activity)=> {
        const { type, data,card,board } = activity;

        switch (type) {
            case "board_created": 
            return <>created the board <Link to={`/board/${data.board_name?.replace(/\s+/g, '')}/${data.boardId}`} className="common-a-tag-css">{data.board_name}</Link> in this workspace.</>;

            case "board_rename": 
            return <>renamed the board from <a className="common-a-tag-css">{data.board_oldName}</a> to <Link to={`/board/${data.board_newName?.replace(/\s+/g, '')}/${data.boardId}`} className="common-a-tag-css">{data.board_newName}</Link> in this workspace.</>;

            case "board_deleted": 
            return <>deleted the board <a className="common-a-tag-css">{data.board_name}</a> from this workspace.</>;

            case "board_visibility_updated":
            return <>changed the visibility of the board <Link to={`/board/${data.board_name?.replace(/\s+/g, '')}/${board?.toString()}`} className="common-a-tag-css">{data.board_name}</Link> from "{data.prevVisibility}" to "{data.newVisibility}".</>;

            case "list_created":
            return <>added the list "{data.list_name}" to the board <Link to={`/board/${data.board_name?.replace(/\s+/g, '')}/${data.boardId}`} className="common-a-tag-css">{data.board_name}</Link>.</>;

            case "list_deleted":
            return <>deleted the list "{data.list_name}" from the board <Link to={`/board/${data.board_name?.replace(/\s+/g, '')}/${data.boardId}`} className="common-a-tag-css">{data.board_name}</Link>.</>;

            case "list_updated":
            return <>renamed the list from "{data.list_oldName}" to "{data.list_newName}" on the board <Link to={`/board/${data.board_name?.replace(/\s+/g, '')}/${data.boardId}`} className="common-a-tag-css">{data.board_name}</Link>.</>;

            case "card_created":
            return <>added the card <Link to={`/card/${data.card_name?.replace(/\s+/g, '')}/${card?.toString()}`} state={{ backgroundLocation: location }} className="common-a-tag-css">{data.card_name}</Link> to the list "{data.list_name}".</>;

            case "card_deleted":
            return <>deleted the card <a className='common-a-tag-css'>{data.card_name}</a> from the board <Link to={`/board/${data.board_name?.replace(/\s+/g, '')}/${data.boardId}`} className="common-a-tag-css">{data.board_name}</Link>.</>;

            case "card_renamed":
            return <>renamed the card from "{data.card_oldName}" to <Link to={`/card/${data.card_newName?.replace(/\s+/g, '')}/${card?.toString()}`} state={{ backgroundLocation: location }} className="common-a-tag-css">{data.card_newName}</Link>.</>;

            case "card_newInfo":
            return <>updated the card name from "{data.card_oldName}" to <Link to={`/card/${data.card_newName?.replace(/\s+/g, '')}/${card?.toString()}`} state={{ backgroundLocation: location }} className="common-a-tag-css">{data.card_newName}</Link> and updated description.</>;

            case "card_newDesc":
            return <>updated the description of the card <Link to={`/card/${data.card_name?.replace(/\s+/g, '')}/${card?.toString()}`} state={{ backgroundLocation: location }} className="common-a-tag-css">{data.card_name}</Link>.</>;

            case "card_deadline_changed":
            return <>updated the deadline of the card <Link to={`/card/${data.card_name?.replace(/\s+/g, '')}/${card?.toString()}`} state={{ backgroundLocation: location }} className="common-a-tag-css">{data.card_name}</Link>.</>;

            case "card_marked":
            return <>marked the card <Link to={`/card/${data.card_name?.replace(/\s+/g, '')}/${card?.toString()}`} state={{ backgroundLocation: location }} className="common-a-tag-css">{data.card_name}</Link> as {data.isCompleted ? "complete" : "incomplete"}.</>;

            case "card_attachment":
                if(data.actionType==='added'){
                    return <>attached <a href={data.newAttachment} className="common-a-tag-css" target="_blank" rel="noopener noreferrer">{data.newAttachment}</a> to the card <Link to={`/card/${data.card_name?.replace(/\s+/g, '')}/${card?.toString()}`} state={{ backgroundLocation: location }} className="common-a-tag-css">{data.card_name}</Link>.</>;
                }
                else if(data.actionType==='updated'){
                    return <>updated attachment <a href={data.oldAttachment} className="common-a-tag-css" target="_blank" rel="noopener noreferrer">{data.oldAttachment}</a> to <a href={data.newAttachment} className="common-a-tag-css" target="_blank" rel="noopener noreferrer">{data.newAttachment}</a> on the card <Link to={`/card/${data.card_name?.replace(/\s+/g, '')}/${card?.toString()}`} state={{ backgroundLocation: location }} className="common-a-tag-css">{data.card_name}</Link>.</>;
                }
                else if(data.actionType==='deleted'){
                    return <>deleted attachment <a href={data.removedAttachment} className="common-a-tag-css" target="_blank" rel="noopener noreferrer">{data.removedAttachment}</a> from the card <Link to={`/card/${data.card_name?.replace(/\s+/g, '')}/${card?.toString()}`} state={{ backgroundLocation: location }} className="common-a-tag-css">{data.card_name}</Link>.</>;
                }
                else {
                    return <>performed an attachment action on the card <Link to={`/card/${data.card_name?.replace(/\s+/g, '')}/${card?.toString()}`} state={{ backgroundLocation: location }} className="common-a-tag-css">{data.card_name}</Link>.</>;
                }

            default:
            return `performed an action : ${type}`;
        }
    }

    return (
        <div className='w-full flex '>
            <div className='h-auto w-auto mr-2'>
                <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center overflow-hidden">
                    {activity.user.profileImage && <img src={activity.user.profileImage} alt="" />}
                </div>
            </div>
            <div className="w-full">
                <div className='w-full text-sm text-gray-700'>
                    <span className="font-semibold mr-1">{activity.user.firstName} {activity.user.lastName}</span>{getActivityMessage(activity)}
                </div>
                <p className="text-xs text-gray-500">
                    {displayTime}
                </p>
            </div>
        </div>
    )
}