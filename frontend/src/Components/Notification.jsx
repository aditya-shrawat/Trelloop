import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';
import socket from '../Socket/socket';
import { useApi } from '../../api/useApi';

const Notification = ({setShowNotifications}) => {
    const divRef = useRef(null);
    const [notifications,setNotifications] = useState([]);
    const [loadingNotifications,setLoadingNotifications] = useState(true)
    const api = useApi();

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (divRef.current && !divRef.current.contains(e.target)) {
            setShowNotifications(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchNotification = async ()=>{
        try {
            const response = await api.get('/notification');

            setNotifications(response.data.notifications)
        } catch (error) {
            console.log("Error while fetching notification - ",error)
        }
        finally{
            setLoadingNotifications(false)
        }
    }

    useEffect(()=>{
        fetchNotification()
    },[])

    return (
        <div ref={divRef} className="w-[90vw] sm:w-96 md:w-[440px] pb-4 h-auto bg-white border-[1px] border-gray-300 shadow-[-2px_2px_10px_rgba(12,12,13,0.1)] rounded-lg z-40 absolute top-full -right-18 overflow-hidden">
            <div className='w-full max-h-[90vh] overflow-y-auto relative'>
                <div className='p-4 sticky top-0 left-0 bg-white'>
                    <h3 className='text-lg text-gray-700 font-semibold'>
                        Notifications
                    </h3>
                </div>
                <div className='w-full px-4 pt-2 pb-2 space-y-4 flex flex-col'>
                    {
                    (loadingNotifications)?
                    <div>Loading notifications...</div>
                    :
                    (notifications.length ===0)?
                    <div>NO notification</div>
                    :
                    notifications.map((notif)=>(
                        <NotificationItem key={notif._id} notif={notif} setNotifications={setNotifications} api={api} />
                    ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Notification

const NotificationItem = ({notif,setNotifications,api})=>{
    const [accepting, setAccepting] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [closing, setClosing] = useState(false);
    const [rejectingBoardRequest,setRejectingBoardRequest] = useState(false)
    const [acceptingBoardRequest,setAcceptingBoardRequest] = useState(false)

    const acceptingInvitation = async (type)=>{
        if(accepting || (type!=='Workspace' && type!=='Board')) return;
        try {
            setAccepting(true);
            
            if(type === 'Workspace'){
                console.log("Workspace invite accept")
                socket.emit("accept_workspace_invite",{workspaceId:notif.workspaceId, userId:notif.userId })
                socket.on("workspace_invite_accepted",(data)=>{
                    console.log("Workspace invite accepted")
                })
            }
            else if(type === 'Board'){
                console.log("board invite accept")
                socket.emit("accept_board_invite",{boardId:notif.boardId,userId:notif.senderId,senderId:notif.userId })
                // socket.on("board_invite_accepted",(data)=>{
                //     console.log("Board invite rejected")
                // })
            }

            const response = await api.post(`/notification/${notif._id}/read`,{isRead:true});

            setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
        } catch (error) {
            console.log("Error while accpting invitation -",error)
        }
        finally {
            setAccepting(false);
        }
    }

    const rejectingInvitation = async (type)=>{
        if(rejecting || (type!=='Workspace' && type!=='Board')) return;
        try {
            setRejecting(true);

            if(type === 'Workspace'){
                console.log("workspace invite reject.")
                socket.emit("reject_workspace_invite",{workspaceId:notif.workspaceId, userId:notif.userId })
                socket.on("workspace_invite_rejected",(data)=>{
                    console.log("Workspace invite rejected")
                })
            }
            else if(type === 'Board'){
                console.log("board invite reject.")
                socket.emit("reject_board_invite",{boardId:notif.boardId,userId:notif.senderId,senderId:notif.userId })
                // socket.on("board_invite_rejected",(data)=>{
                //     console.log("Board invite rejected")
                // })
            }

            const response = await api.post(`/notification/${notif._id}/read`,{isRead:true});

            setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
        } catch (error) {
            console.log("Error while rejecting invitation -",error)
        }
        finally {
            setRejecting(false);
        }
    }

    const closeNotification = async ()=>{
        if(closing) return;
        try {
            setClosing(true) ;

            const response = await api.post(`/notification/${notif._id}/read`,{isRead:true});

            setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
        } catch (error) {
            console.log("Error while closing notificaiton -",error)
        }
        finally{
            setClosing(false)
        }
    }

    const acceptBoardRequest = async ()=>{
        if(acceptingBoardRequest) return;
        try {
            setAcceptingBoardRequest(true);

            socket.emit("accept_board_request",{boardId:notif.boardId,senderId:notif.userId,userId:notif.senderId._id })

            const response = await api.post(`/notification/${notif._id}/read`,{isRead:true});

            setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
        } catch (error) {
            console.log("Error while accpting request -",error)
        }
        finally {
            setAcceptingBoardRequest(false);
        }
    }

    const rejectBoardRequest = async ()=>{
        if(rejectingBoardRequest) return;
        try {
            setRejectingBoardRequest(true);

            socket.emit("reject_board_request",{boardId:notif.boardId,senderId:notif.userId,userId:notif.senderId._id })

            const response = await api.post(`/notification/${notif._id}/read`,{isRead:true});

            setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
        } catch (error) {
            console.log("Error while rejecting board request -",error)
        }
        finally {
            setRejectingBoardRequest(false);
        }
    }

    return(
        (notif.type === 'invite' || notif.type === 'board_invite') ?
        (
        <div className='w-full h-auto p-3 bg-white/40 backdrop-blur-md rounded-md shadow-[0px_0px_4px_rgba(12,12,13,0.2)]'>
            <div className="w-full flex ">
                <div className=" mr-2">
                    <div className="w-7 h-7 rounded-full bg-blue-300 font-semibold text-base text-white flex justify-center items-center overflow-hidden">
                        {notif.senderId.profileImage && <img src={notif.senderId.profileImage} alt="" />}
                    </div>
                </div>
                <p className='text-base text-gray-500'><span className="font-semibold text-base text-gray-700 mr-1">
                    {notif.senderId.firstName} {notif.senderId.lastName}</span> {notif.message}
                </p>
            </div>
            <div className='w-full mt-4 flex justify-evenly '>
                <button onClick={() => rejectingInvitation(notif.type === 'board_invite' ? 'Board' : 'Workspace')}
                        className='outline-button w-[40%] px-2 py-1'>
                    {rejecting ? "Rejecting..." : "Reject"}
                </button>
                <button onClick={() => acceptingInvitation(notif.type === 'board_invite' ? 'Board' : 'Workspace')}
                        className="primary-button w-[40%] px-2 py-1">
                    {accepting ? "Accepting..." : "Accept"}
                </button>
            </div>
        </div>
        )
        :
        (notif.type === 'member_joined' || notif.type === 'invite_rejected' || notif.type === 'member_removed'|| notif.type === 'member_left' 
            || notif.type === 'board_request_accepted' || notif.type ==='board_request_rejected' ||notif.type ==='board_invite_accepted' || notif.type ==='board_invite_rejected' ) ?
        (
        <div className='w-full h-auto p-3 bg-white/40 backdrop-blur-md rounded-md shadow-[0px_0px_4px_rgba(12,12,13,0.2)] '>
            <div className="w-full flex ">
                <div className=" mr-2">
                    <div className="w-7 h-7 rounded-full bg-blue-300 font-semibold text-base text-white flex justify-center items-center overflow-hidden">
                        {notif.senderId.profileImage && <img src={notif.senderId.profileImage} alt="" />}
                    </div>
                </div>
                <p className='text-base text-gray-500'><span className="font-semibold text-base text-gray-700 mr-1">
                    {notif.senderId.firstName} {notif.senderId.lastName}</span> {notif.message}
                </p>
            </div>
            <div className='w-full mt-4 flex justify-end '>
                <button onClick={closeNotification} className='outline-button px-6 py-1'>
                    {closing ? "Closing..." : "Close"}
                </button>
            </div>
        </div>
        ) :
        (notif.type === 'card_deadline') ?
            (
            <div className='w-full h-auto p-3 bg-white/40 backdrop-blur-md rounded-md shadow-[0px_0px_4px_rgba(12,12,13,0.2)] '>
                <div className="w-full flex ">
                    <p className='text-base text-gray-500'>
                        {notif.message}
                    </p>
                </div>
                <div className='w-full mt-4 flex justify-end '>
                    <button onClick={closeNotification} className='outline-button px-6 py-1'>
                        {closing ? "Closing..." : "Close"}
                    </button>
                </div>
            </div>
            )
        : (notif.type === 'board_request') ?
        (<div className='w-full h-auto p-3 bg-white/40 backdrop-blur-md rounded-md shadow-[0px_0px_4px_rgba(12,12,13,0.2)]'>
            <div className="w-full flex ">
                <div className=" mr-2">
                    <div className="w-7 h-7 rounded-full bg-blue-300 font-semibold text-base text-white flex justify-center items-center overflow-hidden">
                        {notif.senderId.profileImage && <img src={notif.senderId.profileImage} alt="" />}
                    </div>
                </div>
                <p className='text-base text-gray-500'>
                    <span className="font-semibold text-base text-gray-700 mr-1">{notif.senderId.firstName} {notif.senderId.lastName}</span> 
                    {notif.message}
                </p>
            </div>
            <div className='w-full mt-4 flex justify-evenly '>
                <button onClick={rejectBoardRequest} className='outline-button w-[40%] px-2 py-1'>
                    {rejectingBoardRequest ? "Rejecting..." : "Reject"}
                </button>
                <button onClick={acceptBoardRequest} className="primary-button w-[40%] px-2 py-1">
                    {acceptingBoardRequest ? "Accepting..." : "Accept"}
                </button>
            </div>
        </div>)
        :null

    )
}