import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';
import socket from '../Socket/socket';

const Notification = ({setShowNotifications}) => {
    const divRef = useRef(null);
    const [notifications,setNotifications] = useState([]);
    const [loadingNotifications,setLoadingNotifications] = useState(true)

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
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/notification`,
                {withCredentials: true}
            );

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
        <div ref={divRef} className="w-[450px] h-auto bg-gray-50 shadow-[0px_0px_10px_rgba(12,12,13,0.3)] rounded-lg z-40 absolute top-12 right-0  ">
            <div className='w-full h-full p-2 '>
                <div className='p-2 '>
                    <h3 className='text-lg text-gray-700 font-semibold'>
                        Notifications
                    </h3>
                </div>
                <div className='w-full p-2 space-y-4 h-auto flex flex-col'>
                    {
                    (loadingNotifications)?
                    <div>Loading notifications...</div>
                    :
                    (notifications.length ===0)?
                    <div>NO notification</div>
                    :
                    notifications.map((notif)=>(
                        <NotificationItem key={notif._id} notif={notif} setNotifications={setNotifications} />
                    ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Notification

const NotificationItem = ({notif,setNotifications})=>{
    const [accepting, setAccepting] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [closing, setClosing] = useState(false);

    const acceptingInvitation = async ()=>{
        if(accepting) return;
        try {
            setAccepting(true);

            socket.emit("accept_workspace_invite",{workspaceId:notif.workspaceId, userId:notif.userId })
            socket.on("workspace_invite_accepted",(data)=>{
                console.log("Workspace invite accepted")
            })

            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.post(`${BackendURL}/notification/${notif._id}/read`,{isRead:true},
                {withCredentials: true}
            );

            setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
        } catch (error) {
            console.log("Error while accpting invitation -",error)
        }
        finally {
            setAccepting(false);
        }
    }

    const rejectingInvitation = async ()=>{
        if(accepting) return;
        try {
            setRejecting(true);

            socket.emit("reject_workspace_invite",{workspaceId:notif.workspaceId, userId:notif.userId })
            socket.on("workspace_invite_rejected",(data)=>{
                console.log("Workspace invite rejected")
            })

            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.post(`${BackendURL}/notification/${notif._id}/read`,{isRead:true},
                {withCredentials: true}
            );

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

            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.post(`${BackendURL}/notification/${notif._id}/read`,{isRead:true},
                {withCredentials: true}
            );

            setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
        } catch (error) {
            console.log("Error while closing notificaiton -",error)
        }
        finally{
            setClosing(false)
        }
    }

    return(
        (notif.type === 'invite') ?
        (
        <div className='w-full h-auto p-3 bg-white rounded-lg shadow-[0px_0px_4px_rgba(12,12,13,0.2)]'>
            <div className="w-full flex ">
                <div className=" mr-2">
                    <div className="w-7 h-7 rounded-full bg-blue-300 font-semibold text-base text-white flex justify-center items-center">
                        {notif.senderId.name[0].toUpperCase()}
                    </div>
                </div>
                <p className='text-base text-gray-500'><span className="font-semibold text-base text-gray-700 mr-1">
                    {notif.senderId.name}</span> {notif.message}
                </p>
            </div>
            <div className='w-full mt-4 flex justify-evenly '>
                <button onClick={acceptingInvitation} className={`w-[40%] px-2 py-1 rounded-lg cursor-pointer outline-none border-none
                     text-base font-semibold text-white ${(accepting)?`bg-[#5fcaca]`:`bg-[#49C5C5] hover:bg-[#5fcaca] hover:shadow-md`}`}>
                    {accepting ? "Accepting..." : "Accept"}
                </button>
                <button onClick={rejectingInvitation} className='w-[40%] px-2 py-1 rounded-lg cursor-pointer outline-none border-[1px] border-gray-300 text-base font-semibold text-gray-700 hover:bg-gray-50 '>
                    {rejecting ? "Rejecting..." : "Reject"}
                </button>
            </div>
        </div>
        )
        :
        (notif.type === 'member_joined' || notif.type === 'invite_rejected' || notif.type === 'member_removed'|| notif.type === 'member_left') ?
        (
        <div className='w-full h-auto p-3 bg-white rounded-lg shadow-[0px_0px_4px_rgba(12,12,13,0.2)] '>
            <div className="w-full flex ">
                <div className=" mr-2">
                    <div className="w-7 h-7 rounded-full bg-blue-300 font-semibold text-base text-white flex justify-center items-center">
                        {notif.senderId.name[0].toUpperCase()}
                    </div>
                </div>
                <p className='text-base text-gray-500'><span className="font-semibold text-base text-gray-700 mr-1">
                    {notif.senderId.name}</span> {notif.message}
                </p>
            </div>
            <div className='w-full mt-4 flex justify-end '>
                <button onClick={closeNotification} className=' px-6 py-1 rounded-lg cursor-pointer outline-none border-[1px] border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50'>
                    {closing ? "Closing..." : "Close"}
                </button>
            </div>
        </div>
        )
        : null
    )
}