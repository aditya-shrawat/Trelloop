import React, { useEffect, useState } from 'react'
import { PiArrowBendDownRightBold } from "react-icons/pi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useUser } from '../../../Contexts/UserContext';
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import { useApi } from '../../../../api/useApi';
dayjs.extend(relativeTime);

export const CommentItem = ({comment}) => {
    const createdAt = dayjs(comment.createdAt);
    const now = dayjs();
    const diffInHours = now.diff(createdAt, 'hour');
    const displayTime = diffInHours < 24 ? createdAt.fromNow() : createdAt.format('MMM DD, YYYY, hh:mm A');

    const [isYou,setIsYou] = useState(false);
    const {user} = useUser();
    const [isReplying,setIsReplying] = useState(false);
    const [showCommentOptions,setShowCommentOptions] = useState(false);
    const [editComment,setEditComment] = useState(false);
    const api = useApi();

    useEffect(()=>{
        if(comment){
            setIsYou(comment.sender._id?.toString()===user._id?.toString());
        }
    },[comment,user])

    return (
        <div className='w-full flex '>
            <div className='h-auto w-auto mr-2'>
                <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center overflow-hidden">
                    {comment.sender.profileImage && <img src={comment.sender.profileImage} alt="" />}
                </div>
            </div>
            <div className="w-full">
                <div className='w-full text-sm text-gray-700 flex justify-between'>
                    <div className="font-semibold line-clamp-1">{comment.sender.firstName} {comment.sender.lastName}</div>
                    {
                    (isYou) && 
                        <div className={`w-auto relative ml-2 ${(showCommentOptions)&&`bg-gray-200`} rounded-md`}>
                            <div onClick={()=>{setShowCommentOptions(true)}} className='py-1 cursor-pointer h-fit shrink-0'>
                                <BsThreeDotsVertical />
                            </div>
                            { showCommentOptions && <CommentOptions commentId={comment._id} setEditComment={setEditComment} closeOptions={()=>setShowCommentOptions(false)} />}
                        </div>
                    }
                </div>
                <div className='py-1.5 px-1 bg-gray-100 rounded-md shadow-sm flex items-center'>
                    <div className='w-full px-1 text-sm text-gray-700'>
                        {
                        (comment && comment.parentComment) &&
                            <span className="text-xs px-2 py-0.5 h-fit text-white bg-teal-500 rounded-lg mr-1 cursor-pointer inline-block shrink-0">
                                {`@${comment.replyTo.firstName} ${comment.replyTo.lastName}`}
                            </span>
                        }
                        {
                        (!editComment)?
                            <>{comment.content}</>
                        :
                            <EditCommentContent closeEditing={()=>setEditComment(false)} commentId={comment._id} currentContent={comment.content} api={api} />
                        }
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
                        (<ReplyContainer commentId={comment._id} onClose={()=>{setIsReplying(false)}} api={api} />)
                    }
                </div>
            </div>
        </div>
    )
}


const ReplyContainer = ({commentId,onClose,api})=>{
    const [replyContent,setReplyContent] = useState("");
    const {id} = useParams();

    const handleInput = (e)=>{
        e.preventDefault();

        setReplyContent(e.target.value)
    }

    const replyComment = async ()=>{
        if(!replyContent || replyContent.trim()==="") return;
        try {
            const response = await api.post(`/card/${id}/comment/${commentId}/reply`,
                {replyContent}
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
                <button onClick={onClose} className='outline-button px-3 py-1 text-sm mr-4'>
                    Cancel
                </button>
                <button onClick={replyComment} className='primary-button text-sm px-3 py-1'>
                    Reply
                </button>
            </div>
        </div>
    )
}


export const CommentOptions = ({commentId,setEditComment,closeOptions})=>{
    const divref = useRef();
    const [deletingComment,setDeletingComment] = useState(false)
    const [errorMsg,setErrorMsg] = useState("")
    const api = useApi()

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            closeOptions()
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const deleteComment = async (e)=>{
        e.preventDefault();
        try {
            console.log(commentId)
            const response = await api.delete(`/api/comment/${commentId}/delete`);

            console.log(response.data.message)
            closeOptions()
        } catch (error) {
            console.log("Error while deleteing comment ",error)
        }
    }

    return (
        
        <div ref={divref} className='w-64 px-3 py-4 h-auto border-[1px] rounded-lg z-10 bg-white shadow-[0px_0px_12px_rgba(12,12,13,0.2)]
         border-gray-300 absolute top-[130%] right-0 '>
            {
            (deletingComment)?
                <div className='w-full px-1'>
                    <h1 className='text-gray-700 font-semibold'>Delete comment?</h1>
                    <p className='text-gray-400 text-sm'>This comment will be permanently removed from the card and cannot be undone.</p>
                    <div className='w-full flex items-center mt-6'>
                        <div onClick={deleteComment} className='w-full py-1 text-center bg-red-500 rounded-md text-white font-semibold cursor-pointer '>
                            Delete
                        </div>
                    </div>
                </div>
            :
                <div className='w-full space-y-1'>
                    <div onClick={()=>{setEditComment(true);closeOptions()}} className='text-gray-700 hover:bg-gray-100 font-semibold rounded-md px-2 py-1 cursor-pointer flex items-center'>
                        <div className='mr-3'><FiEdit/></div> Edit
                    </div>
                    <div onClick={()=>{setDeletingComment(true)}} className='text-gray-700 hover:bg-gray-100 hover:text-red-600 font-semibold rounded-md px-2 py-1 cursor-pointer flex items-center'>
                        <div className='mr-3'><RiDeleteBin6Line/></div> Delete
                    </div>
                </div>
            } 
        </div>
    )
}

export const EditCommentContent = ({closeEditing,commentId,currentContent})=>{
    const divref = useRef();
    const [newContent,setNewContent] = useState(currentContent);
    const api = useApi()

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            closeEditing()
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInput = (e)=>{
        e.preventDefault();
        setNewContent(e.target.value)
    }

    const editComment = async (e)=>{
        e.preventDefault();
        if(!newContent && newContent.trim()==="") return;
        try {
            console.log(commentId)
            console.log(newContent)
            const response = await api.post(`/api/comment/${commentId}/edit-content`,
                {newContent}
            );

            console.log(response.data.message)
            closeEditing()
        } catch (error) {
            console.log("Error while updating comment ",error)
        }
    }


    return (
        <div ref={divref} className='w-full flex flex-col items-end'>
            <div className='w-full mt-1 border-[1px] border-gray-300 rounded-md'>
                <input type="text" value={newContent} onChange={handleInput} className='w-full px-1 py-1 outline-none border-none bg-transparent'/>
            </div>
            <div className='w-fit h-fit mt-2 flex'>
                <button onClick={closeEditing} className='outline-button px-3 py-1 text-sm mr-4'>
                    Cancel
                </button>
                <button onClick={editComment} className='primary-button px-4 py-1 text-sm text-white'>
                    Save
                </button>
            </div>
        </div>
    )
}