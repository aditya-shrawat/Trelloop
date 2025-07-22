import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ActivityItem from './ActivityItem'
import { IoIosSend } from "react-icons/io";
import socket from '../../../Socket/socket'
import CommentItem from './CommentItem'

const ActivityContainer = ({UserRole,currentUser}) => {
    const {id} = useParams();
    const [cardActivities,setCardActivities] = useState(null)
    const [loadingCardActivities,setLoadingCardActivities] = useState(true)
    const [commentContent,setCommentContent] = useState("");

    const fetchCardActivities = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/card/activities/${id}`,
            {withCredentials: true}
            );

            setCardActivities(response.data.allActivities)
        } catch (error) {
            console.log("Error while fetching card activities - ",error)
        }
        finally{
            setLoadingCardActivities(false)
        }
    }

    useEffect(()=>{
        if(id){
            fetchCardActivities()
        }
    },[id])

    const handleInput = (e)=>{
        e.preventDefault();

        setCommentContent(e.target.value)
    }

    const handleCommentSubmit = async ()=>{
        if(!commentContent || commentContent.trim()==="") return;
        try {
            console.log(commentContent)

            socket.emit("add_comment", {
                cardId:id,
                content:commentContent,
                senderId:currentUser.id
            });

            socket.once("comment_added", (data) => {
                console.log("comment status : ", data);
            });
            setCommentContent("")
        } catch (error) {
            console.log("Error in comment handler- ",error)
        }
    }


  return (
    <div className="w-full h-full space-y-4 ">
        {(UserRole.isBoardMember || UserRole.isWorkspaceMember || UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin) &&
            (<div className="flex ">
                <div className='h-auto w-auto mr-3'>
                    <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center">
                        <span className=" font-semibold text-white text-lg">
                            {currentUser && currentUser.name[0].toUpperCase()}
                        </span>
                    </div>
                </div>
                <input placeholder="Write a comment..." value={commentContent} onChange={handleInput} 
                    className="w-full px-2 py-1 border-[1px] border-gray-300 outline-none rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 "
                />
                <div onClick={handleCommentSubmit} className='w-fit px-2 py-1 bg-[#49C5C5] cursor-pointer rounded-md flex items-center justify-center ml-3'>
                    <IoIosSend className='text-xl text-white' />
                </div>
            </div>)
        }
        { (loadingCardActivities) ?
            <div>Loading activity</div> :
            (cardActivities?.map((item)=>{
                if(item._type==='activity'){
                    return <ActivityItem key={item._id} activity={item}  />
                }
                else if(item._type==='comment'){
                    return <CommentItem key={item._id} comment={item}  />
                }
                else 
                    return null;
            }))
        }
    </div>
  )
}

export default ActivityContainer