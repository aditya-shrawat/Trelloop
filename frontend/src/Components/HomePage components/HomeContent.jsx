import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { FaRegClock } from "react-icons/fa6";
import { useUser } from '../../Contexts/UserContext';
import { BsThreeDotsVertical } from "react-icons/bs";
import { CommentOptions, EditCommentContent } from '../CardFunctionalities/Card Activity/CommentItem';
import { Link } from 'react-router-dom';
import { IoIosSend } from "react-icons/io";
import { useRef } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);


const HomeContent = () => {
    const [receivedComments,setReceivedComments] = useState([]);
    const [loadinMainFeed,setLoadingMainFeed] = useState(true);

    const fetchReceivedComments = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/api/home`,
                {withCredentials: true}
            );

            setReceivedComments(response.data.allComments);
        } catch (error) {
            console.log("Error while fetching main feed - ",error)
        }
        finally{
            setLoadingMainFeed(false)
        }
    }

    useEffect(()=>{
        fetchReceivedComments()
    },[])


  return (
    <div className=' w-full h-full py-4'>
        {
        (loadinMainFeed)?
            <div>Loaing...</div>
        :
        (receivedComments && receivedComments.length !== 0)?
            <div className='w-full h-auto space-y-6'>
                {
                receivedComments?.map((comment)=>(
                    <CommentItem key={comment._id} comment={comment} />
                ))
                }
            </div>
        :
            <div className='w-full h-full'>
                <div className='w-full h-fit rounded-lg overflow-hidden border-[0.5px] border-gray-300 shadow-[0px_2px_6px_rgba(12,12,13,0.2)]'>
                    <div className='w-full h-52 bg-[#C7EBFF] '>
                        <img src={`/reminder2.png`} className='h-full w-full object-contain' />
                    </div>
                    <div className='w-full text-center p-6'>
                        <h1 className='text-lg font-semibold text-gray-700'>Plan smarter. Work better.</h1>
                        <h3 className='text-sm text-gray-500'>Collaborate with others, manage your to-do's, and keep track of your most important work.</h3>
                    </div>
                </div>
            </div>
        }
    </div>
  )
}

export default HomeContent


const CommentItem = ({comment})=>{
    const [isYou,setIsYou] = useState(false);
    const {user} = useUser();
    const [showCommentOptions,setShowCommentOptions] = useState(false);
    const [editComment,setEditComment] = useState(false);
    const [isReplying,setIsReplying] = useState(false);

    const displayTime = dayjs(comment.createdAt).fromNow();

    useEffect(()=>{
        if(comment){
            setIsYou(comment.sender._id?.toString()===user.id?.toString());
        }
    },[comment,user])


    return(
        <div className='p-1 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1' style={{background:comment.board.background}}>
            <Link to={`/card/${(comment.card.name).replace(/\s+/g, '')}/${comment.card._id}`} 
                className='w-full block text-white px-2 pt-2 pb-3 cursor-pointer'>
                <div className='w-auto flex'>
                    <div className='inline-block font-semibold'>{comment.card.name}</div>
                        {(comment.card.deadline && comment.card.deadline)&&
                            <div className='text-xs flex items-center px-3'>
                                <div className='mr-1'><FaRegClock /></div>
                                {new Date(comment.card.deadline).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                        month: "long",
                                })}
                            </div>
                        }
                </div>
                <div className='w-full text-xs font-semibold'>
                    {comment.workspace.name} <span className='font-semibold mx-1'>|</span>
                    {comment.board.name}
                </div>
            </Link>
            <div className='w-full bg-white rounded-md px-3 py-4 text-gray-700'>
                <div className='w-full '>
                    <div className='w-full flex items-center'>
                        <div className='h-auto w-auto mr-2'>
                            <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center">
                                <span className="font-semibold text-white text-lg ">
                                    {comment.sender.name && comment.sender.name[0].toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className='w-full text-sm flex justify-between'>
                                <div>
                                    <div className="font-semibold line-clamp-1">
                                        {comment.sender.name}
                                    </div>
                                    <div className='text-gray-500 text-xs'>{displayTime}</div>
                                </div>
                                {
                                    (isYou) && 
                                    <div className={`w-auto h-fit relative ml-2 ${(showCommentOptions)&&`bg-gray-200`} rounded-md`}>
                                        <div onClick={()=>{setShowCommentOptions(true)}} className='py-1 cursor-pointer h-fit shrink-0'>
                                            <BsThreeDotsVertical />
                                        </div>
                                        { showCommentOptions && <CommentOptions commentId={comment._id} setEditComment={setEditComment} closeOptions={()=>setShowCommentOptions(false)} />}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center mt-2'>
                        <div className='w-full text-sm'>
                            {
                            (comment && comment.parentComment) &&
                                <span className="text-xs px-2 py-0.5 h-fit text-white bg-[#49C5C5] rounded-lg mr-1 cursor-pointer inline-block shrink-0">
                                    @{comment.replyTo.name}
                                </span>
                            }
                            {
                            (!editComment)?
                                <>{comment.content}</>
                            :
                                <EditCommentContent closeEditing={()=>setEditComment(false)} commentId={comment._id} currentContent={comment.content} />
                            }
                        </div>
                    </div>
                </div>
                <div className='w-full mt-4'>
                    {
                    (!isReplying)?
                        <div className='w-full flex justify-between border-[1px] border-gray-300 rounded-md'>
                            <button onClick={()=>{setIsReplying(true)}} className='w-full py-1 text-gray-500 font-semibold flex justify-center items-center cursor-pointer outline-none border-none'>
                                <div className='mr-1 text-lg'><IoIosSend /></div>Reply
                            </button>
                        </div>
                    :
                        (
                        <div className="fade-slide-in w-full">
                            <ReplyComment cardId={comment.card._id} commentId={comment._id} onClose={() => setIsReplying(false)} currentUser={user} />
                        </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}


const ReplyComment = ({cardId,commentId,onClose,currentUser})=>{
    const divref = useRef();
    const [replyContent,setReplyContent] = useState("");
    const inputRef = useRef()

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            onClose()
          }
        };
        document.addEventListener("mousedown", handleClickOutside);

        inputRef.current?.focus();
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInput = (e)=>{
        e.preventDefault();

        setReplyContent(e.target.value)
    }

    const replyComment = async ()=>{
        if(!replyContent || replyContent.trim()==="") return;
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.post(`${BackendURL}/card/${cardId}/comment/${commentId}/reply`,
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
        <div ref={divref} className='w-full px-2 py-3 flex flex-col items-end border-[1px] border-gray-300 rounded-md'>
            <div className='w-full flex items-center'>
                <div className='h-auto w-auto mr-2'>
                    <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center">
                        <span className="font-semibold text-white text-lg ">
                            {currentUser.name && currentUser.name[0].toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className='w-full'>
                    <input ref={inputRef} type="text"  placeholder='Reply...' value={replyContent} onChange={handleInput}
                        className='w-full px-2 py-1.5 rounded-md text-sm outline-none border-2 border-[#49C5C5] bg-transparent text-gray-700' />
                </div>
            </div>
            <div className='w-fit h-fit mt-3 flex'>
                <button onClick={onClose} className='text-gray-500 px-4 py-1 rounded-md text-xs font-semibold border-[1px] border-gray-300 hover:bg-gray-100 outline-none mr-4 cursor-pointer'>
                    Cancel
                </button>
                <button onClick={replyComment} className='px-4 py-1 rounded-md text-xs text-white font-semibold bg-[#49C5C5] outline-none cursor-pointer'>
                    Reply
                </button>
            </div>
        </div>
    )
}