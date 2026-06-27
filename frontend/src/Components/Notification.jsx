import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';
import socket from '../Socket/socket';
import { useApi } from '../../api/useApi';
import CircularProgress from '@mui/material/CircularProgress';

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
                <div className='w-full px-4 pt-2 pb-2 space-y-2 flex flex-col'>
                    {
                    (loadingNotifications)?
                        <div className="w-full text-center py-4">
                            <CircularProgress size="30px" sx={{ color: '#059669' }} />
                        </div>
                    :
                    (notifications.length ===0)?
                        <div className="text-gray-400 text-center py-2">No notifications yet.</div>
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
    const [loadingAction, setLoadingAction] = useState(null); 

    const acceptingInvitation = async (type)=>{
        if(loadingAction || (type!=='Workspace' && type!=='Board')) return;
        try {
            setLoadingAction('accepting');
            
            if(type === 'Workspace'){
                console.log("Workspace invite accept")
                socket.emit("accept_workspace_invite",{workspaceId:notif.workspaceId, userId:notif.userId })
                socket.once("workspace_invite_accepted",(data)=>{
                    console.log("Workspace invite accepted")
                })
            }
            else if(type === 'Board'){
                console.log("board invite accept")
                socket.emit("accept_board_invite",{boardId:notif.boardId,userId:notif.senderId,senderId:notif.userId })
            }

            await api.post(`/notification/${notif._id}/read`,{isRead:true});
            setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
        } catch (error) {
            console.log("Error while accpting invitation -",error)
        }
        finally {
            setLoadingAction(null);
        }
    }

    const rejectingInvitation = async (type)=>{
        if(loadingAction || (type!=='Workspace' && type!=='Board')) return;
        try {
            setLoadingAction('rejecting');

            if(type === 'Workspace'){
                console.log("workspace invite reject.")
                socket.emit("reject_workspace_invite",{workspaceId:notif.workspaceId, userId:notif.userId })
                socket.once("workspace_invite_rejected",(data)=>{
                    console.log("Workspace invite rejected")
                })
            }
            else if(type === 'Board'){
                console.log("board invite reject.")
                socket.emit("reject_board_invite",{boardId:notif.boardId,userId:notif.senderId,senderId:notif.userId })
            }

            await api.post(`/notification/${notif._id}/read`,{isRead:true});
            setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
        } catch (error) {
            console.log("Error while rejecting invitation -",error)
        }
        finally {
            setLoadingAction(null);
        }
    }

    const closeNotification = async ()=>{
        if(loadingAction) return;
        try {
            setLoadingAction('closing');

            await api.post(`/notification/${notif._id}/read`,{isRead:true});
            setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
        } catch (error) {
            console.log("Error while closing notificaiton -",error)
        }
        finally{
            setLoadingAction(null);
        }
    }

    const acceptBoardRequest = async ()=>{
        if(loadingAction) return;
        try {
            setLoadingAction('acceptingBoardRequest');

            socket.emit("accept_board_request",{boardId:notif.boardId,senderId:notif.userId,userId:notif.senderId._id })

            await api.post(`/notification/${notif._id}/read`,{isRead:true});
            setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
        } catch (error) {
            console.log("Error while accpting request -",error)
        }
        finally {
            setLoadingAction(null);
        }
    }

    const rejectBoardRequest = async ()=>{
        if(loadingAction) return;
        try {
            setLoadingAction('rejectingBoardRequest');

            socket.emit("reject_board_request",{boardId:notif.boardId,senderId:notif.userId,userId:notif.senderId._id })

            await api.post(`/notification/${notif._id}/read`,{isRead:true});
            setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
        } catch (error) {
            console.log("Error while rejecting board request -",error)
        }
        finally {
            setLoadingAction(null);
        }
    }

    const getNotifContent = () => {
        if (notif.type === 'invite' || notif.type === 'board_invite') {
            return (
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
                                disabled={loadingAction !== null}
                                className='outline-button w-[40%] px-2 py-1'>
                            {loadingAction === 'rejecting' ? "Rejecting..." : "Reject"}
                        </button>
                        <button onClick={() => acceptingInvitation(notif.type === 'board_invite' ? 'Board' : 'Workspace')}
                                disabled={loadingAction !== null}
                                className="primary-button w-[40%] px-2 py-1">
                            {loadingAction === 'accepting' ? "Accepting..." : "Accept"}
                        </button>
                    </div>
                </div>
            );
        }

        if (['member_joined', 'invite_rejected', 'member_removed', 'member_left',
             'board_request_accepted', 'board_request_rejected', 'board_invite_accepted', 'board_invite_rejected', 'workspace_deleted'].includes(notif.type)) {
            return (
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
                        <button onClick={closeNotification} disabled={loadingAction !== null} className='outline-button px-6 py-1'>
                            {loadingAction === 'closing' ? "Closing..." : "Close"}
                        </button>
                    </div>
                </div>
            );
        }

        if (notif.type === 'card_deadline') {
            return (
                <div className='w-full h-auto p-3 bg-white/40 backdrop-blur-md rounded-md shadow-[0px_0px_4px_rgba(12,12,13,0.2)] '>
                    <div className="w-full flex ">
                        <p className='text-base text-gray-500'>
                            {notif.message}
                        </p>
                    </div>
                    <div className='w-full mt-4 flex justify-end '>
                        <button onClick={closeNotification} disabled={loadingAction !== null} className='outline-button px-6 py-1'>
                            {loadingAction === 'closing' ? "Closing..." : "Close"}
                        </button>
                    </div>
                </div>
            );
        }

        if (notif.type === 'board_request') {
            return (
                <div className='w-full h-auto p-3 bg-white/40 backdrop-blur-md rounded-md shadow-[0px_0px_4px_rgba(12,12,13,0.2)]'>
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
                        <button onClick={rejectBoardRequest} disabled={loadingAction !== null} className='outline-button w-[40%] px-2 py-1'>
                            {loadingAction === 'rejectingBoardRequest' ? "Rejecting..." : "Reject"}
                        </button>
                        <button onClick={acceptBoardRequest} disabled={loadingAction !== null} className="primary-button w-[40%] px-2 py-1">
                            {loadingAction === 'acceptingBoardRequest' ? "Accepting..." : "Accept"}
                        </button>
                    </div>
                </div>
            );
        }

        return null;
    }

    return getNotifContent();
}