import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ActivityItem from './ActivityItem'
import { IoIosSend } from "react-icons/io";
import socket from '../../../Socket/socket'
import { CommentItem } from './CommentItem'
import { useApi } from '../../../../api/useApi'

const ActivityContainer = ({UserRole,currentUser}) => {
    const {id} = useParams();
    const [cardActivities,setCardActivities] = useState(null)
    const [loadingCardActivities,setLoadingCardActivities] = useState(true)
    const [commentContent,setCommentContent] = useState("");
    const api = useApi();

    const fetchCardActivities = async ()=>{
        try {
            const response = await api.get(`/card/activities/${id}`);

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
            socket.emit("add_comment", {
                cardId:id,
                content:commentContent,
                senderId:currentUser._id
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
            (<div className="flex mb-6">
                <div className='h-auto w-auto mr-3'>
                    <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center overflow-hidden">
                        {currentUser && <img src={currentUser.profileImage} alt="" />}
                    </div>
                </div>
                <input placeholder="Write a comment..." value={commentContent} onChange={handleInput} 
                    className="w-full px-2 py-1 border-[1px] border-gray-300 outline-none rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 "
                />
                <div onClick={handleCommentSubmit} className='primary-button w-fit px-2 py-1 flex items-center justify-center ml-3'>
                    <IoIosSend className='text-xl text-white' />
                </div>
            </div>)
        }
        { (loadingCardActivities) ?
            <div>Loading activity</div> :
            (cardActivities && cardActivities?.map((item)=>{
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