import React, { useEffect, useState } from 'react'
import { PiArrowBendDownRightBold } from "react-icons/pi";
import { BsThreeDotsVertical } from "react-icons/bs";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useUser } from '../../../Contexts/UserContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
dayjs.extend(relativeTime);

const CommentItem = ({comment}) => {
    const createdAt = dayjs(comment.createdAt);
    const now = dayjs();
    const diffInHours = now.diff(createdAt, 'hour');
    const displayTime = diffInHours < 24 ? createdAt.fromNow() : createdAt.format('MMM DD, YYYY, hh:mm A');

    const [isYou,setIsYou] = useState(false);
    const {user} = useUser();
    const [isReplying,setIsReplying] = useState(false);

    useEffect(()=>{
        if(comment){
            setIsYou(comment.sender._id?.toString()===user.id?.toString());
        }
    },[comment,user])

    return (
        <div className='w-full flex '>
            <div className='h-auto w-auto mr-2'>
                <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center">
                    <span className="font-semibold text-white text-lg ">
                        {comment.sender.name && comment.sender.name[0].toUpperCase()}
                    </span>
                </div>
            </div>
            <div className="w-full">
                <div className='w-full text-sm text-gray-700 flex justify-between'>
                    <div className="font-semibold line-clamp-1">{comment.sender.name}</div>
                    {
                    (isYou) && 
                        <div className='py-1 cursor-pointer h-fit shrink-0 ml-2 '>
                            <BsThreeDotsVertical />
                        </div>
                    }
                </div>
                <div className='py-1.5 px-1 bg-gray-100 rounded-md shadow-sm flex'>
                    <div className='w-full px-1 text-sm text-gray-700'>
                        {
                        (comment && comment.parentComment) &&
                            <span className="text-xs px-2 py-0.5 h-fit text-white bg-[#49C5C5] rounded-lg mr-1 cursor-pointer inline-block shrink-0">
                                @{comment.receiver.name}
                            </span>
                        }
                        {`${comment.content}`}
                    </div>
                </div>
                <div className='w-full'>
                    {
                    (!isReplying)?
                        (<div className='w-full px-1 flex justify-between mt-1'>
                            <div onClick={()=>{setIsReplying(true)}} className='text-xs text-gray-500 font-semibold hover:underline inline-block cursor-pointer'>
                                Reply
                            </div>
                            <div className='text-gray-500 text-xs'>{displayTime}</div>
                        </div>
                        )
                    :
                        (<ReplyContainer commentId={comment._id} onClose={()=>{setIsReplying(false)}} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default CommentItem


const ReplyContainer = ({commentId,onClose})=>{
    const [replyContent,setReplyContent] = useState("");
    const {id} = useParams();

    const handleInput = (e)=>{
        e.preventDefault();

        setReplyContent(e.target.value)
    }

    const replyComment = async ()=>{
        if(!replyContent || replyContent.trim()==="") return;
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.post(`${BackendURL}/card/${id}/comment/${commentId}/reply`,
                {replyContent},
                {withCredentials: true}
            );

            console.log(response.data.message);
            onClose()
        } catch (error) {
            console.log("Error while replying comment ",error)
        }
    }

    return (
        <div className='w-full mt-2 flex flex-col items-end'>
            <div className='w-full pl-2 flex'>
                <div className='text-gray-500 text-lg mt-0.5 mr-1'><PiArrowBendDownRightBold /></div>
                <div className='w-full rounded-md border-[1px] border-gray-300 px-2'>
                    <input type="text" value={replyContent} onChange={handleInput} placeholder='Reply...'
                        className='w-full py-1 outline-none text-gray-700 text-sm' />
                </div>
            </div>
            <div className='w-fit h-fit mt-2 flex'>
                <button onClick={onClose} className='text-gray-500 px-2 py-1 rounded-md text-xs font-semibold border-[1px] border-gray-300 hover:bg-gray-100 outline-none mr-4 cursor-pointer'>
                    Cancel
                </button>
                <button onClick={replyComment} className='px-2 py-1 rounded-md text-xs text-white font-semibold bg-[#49C5C5] outline-none cursor-pointer'>
                    Reply
                </button>
            </div>
        </div>
    )
}