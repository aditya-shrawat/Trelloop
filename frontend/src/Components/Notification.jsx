import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';

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
        <div ref={divRef} className="w-[430px] h-auto bg-white shadow-[0px_0px_10px_rgba(12,12,13,0.3)] rounded-lg z-40 absolute top-12 right-0  ">
            <div className='w-full h-full p-2 '>
                <div className='p-2 mb-3 border-b-[1px] border-gray-300'>
                    <h3 className='text-lg text-gray-700 font-semibold'>
                        Notifications
                    </h3>
                </div>
                <div className='px-2 w-full h-auto flex flex-col'>
                    {
                    (loadingNotifications)?
                    <div>Loading notifications...</div>
                    :
                    (notifications.length ===0)?
                    <div>NO notification</div>
                    :
                    notifications.map((notif)=>(
                        <NotificationItem key={notif._id} notif={notif} />
                    ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Notification

const NotificationItem = ({notif})=>{
    return(
        <div className='w-full h-auto px-1.5 py-4 mb-4 hover:bg-gray-50 border-b-[1px] border-gray-300'>
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
                <button className='w-[40%] px-2 py-1 rounded-lg cursor-pointer outline-none border-none text-base font-semibold text-white bg-blue-300'>
                    Accept
                </button>
                <button className='w-[40%] px-2 py-1 rounded-lg cursor-pointer outline-none border-[1px] border-gray-300 text-base font-semibold text-gray-700 hover:bg-gray-100 '>
                    Reject
                </button>
            </div>
        </div>
    )
}