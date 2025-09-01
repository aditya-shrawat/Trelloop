import React from 'react'
import { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect } from 'react';
import { useApi } from '../../../api/useApi';

dayjs.extend(relativeTime);

const BoardActivity = ({boardId,setShowActivity})=>{
    const [activities,setActivities] = useState([])
    const [loadingActivities,setLoadingActivities] = useState(true)
    const api = useApi();

    const fetchBoardActivities = async ()=>{
        try {
            const response = await api.get(`/board/${boardId}/activities`);

            setActivities(response.data.activities)
        } catch (error) {
            console.log("Error while fetching board activities - ",error)
        }
        finally{
            setLoadingActivities(false)
        }
    }

    useEffect(()=>{
        if(boardId){
            fetchBoardActivities()
        }
    },[boardId])


    return (
        <div className='bg-white w-full p-4 h-auto rounded-lg overflow-hidden'>
            <div className='w-full h-auto max-h-[480px] overflow-y-auto overflow-x-hidden relative'>
                <div className='w-full text-start py-1 bg-white sticky left-0 top-0'>
                    <h1 className='text-lg font-semibold text-gray-700 flex items-center'>
                        <span onClick={()=>setShowActivity(false)} className='cursor-pointer p-1 mr-1'><IoIosArrowBack /></span> 
                        Board activity
                    </h1>
                </div>
                <div className='w-full h-full space-y-2 mt-4'>
                    { (loadingActivities) ?
                        <div className='h-10 w-full flex items-center justify-center'>Loading workspace activities...</div> :
                        (activities.length !==0)?
                        (activities.map((activity)=>(
                            <BoardActivityItem key={activity._id} activity={activity}  />
                        ))):
                        (
                        <div className='h-10 w-full flex items-center justify-center'>No activity</div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default BoardActivity


const BoardActivityItem = ({activity})=>{
    const createdAt = dayjs(activity.createdAt);
    const now = dayjs();
    const diffInHours = now.diff(createdAt, 'hour');
    const displayTime = diffInHours < 24 ? createdAt.fromNow() : createdAt.format('MMM DD, YYYY, hh:mm A');


    const getActivityMessage =(activity)=> {
        const { type, data,card } = activity;

        switch (type) {
            case "board_created": 
            return <>created the board.</>;

            case "board_rename":
            return <>renamed the board from "{data.board_oldName}" to "{data.board_newName}".</>;

            case "board_visibility_updated":
            return <>changed the visibility of the board from "{data.prevVisibility}" to "{data.newVisibility}".</>;

            case "list_created":
            return <>added the list "{data.list_name}" to the board.</>;

            case "list_deleted":
            return <>deleted the list "{data.list_name}" from the board.</>;

            case "list_updated":
            return <>renamed the list from "{data.list_oldName}" to "{data.list_newName}".</>;

            case "card_created":
            return <>added the card <a href={`/card/${(data.card_name).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_name}</a> to the list "{data.list_name}".</>;

            case "card_deleted":
            return <>deleted the card <a className='common-a-tag-css'>{data.card_name}</a> from the board.</>;

            case "card_renamed":
            return <>renamed the card from "{data.card_oldName}" to <a href={`/card/${(data.card_newName).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_newName}</a>.</>;

            case "card_newInfo":
            return <>updated the card name from "{data.card_oldName}" to <a href={`/card/${(data.card_newName).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_newName}</a> and updated description.</>;

            case "card_newDesc":
            return <>updated the description of the card <a href={`/card/${(data.card_name).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_name}</a>.</>;

            case "card_deadline_changed":
            return <>updated the deadline of the card <a href={`/card/${(data.card_name).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_name}</a>.</>;

            case "card_marked":
            return <>marked the card <a href={`/card/${(data.card_name).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_name}</a> as {(data.isCompleted)?"complete":"incomplete"}.</>

            case "card_attachment":
                if(data.actionType==='added'){
                    return <>attached <a href={data.newAttachment} className="common-a-tag-css" target="_blank" rel="noopener noreferrer">{data.newAttachment}</a> to the card <a href={`/card/${(data.card_name).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_name}</a>.</>; 
                }
                else if(data.actionType==='updated'){
                    return <>updated attachment <a href={data.oldAttachment} className="common-a-tag-css" target="_blank" rel="noopener noreferrer">{data.oldAttachment}</a> to <a href={data.newAttachment} className="common-a-tag-css" target="_blank" rel="noopener noreferrer">{data.newAttachment}</a> on the card <a href={`/card/${(data.card_name).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_name}</a>.</>; 
                }
                else if(data.actionType==='deleted'){
                    return <>deleted attachment <a href={data.removedAttachment} className="common-a-tag-css" target="_blank" rel="noopener noreferrer">{data.removedAttachment}</a> from the card <a href={`/card/${(data.card_name).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_name}</a>.</>; 
                }
                else {
                    return <>performed an attachment action on the card <a href={`/card/${(data.card_name).replace(/\s+/g, '')}/${card?.toString()}`} className="common-a-tag-css">{data.card_name}</a>.</>;
                }

            default:
            return `performed an action : ${type}`;
        }
    }

    return (
        <div className='w-full flex '>
            <div className='h-auto w-auto mr-3'>
                <div className="w-7 h-7 rounded-full bg-blue-300 flex items-center justify-center overflow-hidden">
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