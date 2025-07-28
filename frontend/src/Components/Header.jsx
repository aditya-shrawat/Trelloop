import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import CreateWorkspace from "./CreateWorkspace";
import CreateBoard from "./CreateBoard";
import axios from "axios";
import { Link } from "react-router-dom";
import { useUser } from "../Contexts/UserContext.jsx";
import Notification from "./Notification.jsx";
import { cleanupNotificationListener, registerUserSocket, setupNotificationListener } from "../Socket/socketService.js";
import socket from "../Socket/socket.js";
import { TbStar } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineLightMode } from "react-icons/md";

const Header = ({onBoard}) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const [openProfileNav,setOpenProfileNav] = useState(false)
    const [unreadCount,setUnreadCount]= useState(0); 
    const [showNotifications,setShowNotifications] = useState(false);

    const {user} = useUser();

    useEffect(() => {
        if (!user?.id) return;

        registerUserSocket(socket,user.id);
        setupNotificationListener(socket,setUnreadCount);

        return () => {
            cleanupNotificationListener(socket);
        };
    },[user]);

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpenDropdown(null);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchUnreadNotificationCount = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/notification/count`,
                {withCredentials: true}
            );

            setUnreadCount(response.data.notifCount);
        } catch (error) {
            console.log("Error while counting unread notif. ",error)
        }
    }

    useEffect(()=>{
        fetchUnreadNotificationCount()
    },[])

  return (
    <header className={`w-full z-20 h-auto shadow-sm ${(onBoard)?`backdrop-blur-md bg-white/20`:`bg-white`} fixed top-0`} >
        <div className="w-full h-14 px-6 flex items-center justify-between ">
            <div className="w-full h-full flex items-center ">
                <div className={`inline-block font-bold ${(onBoard)?`text-white`:`text-teal-600`} text-2xl mr-4`}>
                    Trelloop
                </div>
                <div className={`w-full h-auto ${(onBoard)?`text-white`:`text-gray-500`} hidden sm:block`}>
                    <div className="w-auto h-auto inline-block relative ">
                        <div onClick={()=>setOpenDropdown(openDropdown === "workspace" ? null : "workspace")}
                         className="px-2 py-1 hover:text-gray-700 cursor-pointer rounded-lg 
                         flex items-center font-semibold">
                            Workspaces
                            <IoMdArrowDropdown className={`ml-1 text-2xl ${(openDropdown === "workspace")?
                                `rotate-180 transition-transform duration-300`:`rotate-0 transition-transform duration-300`} `} 
                            />
                        </div>

                        {openDropdown === "workspace" && (
                            <div ref={dropdownRef} className="absolute top-full left-0 mt-4 z-30 w-[300px]">
                            <WorkspaceDropDown />
                            </div>
                        )}
                    </div>
                    <div className="w-auto h-auto inline-block relative">
                        <div onClick={()=>setOpenDropdown(openDropdown === "starred" ? null : "starred")}
                            className="px-2 py-1 ml-3 hover:text-gray-700 cursor-pointer rounded-lg 
                            flex items-center font-semibold">
                            Starred <IoMdArrowDropdown className={`ml-1 text-2xl ${(openDropdown === "starred")?
                                `rotate-180 transition-transform duration-300`:`rotate-0 transition-transform duration-300`} `}
                             />
                        </div>
                        
                        {openDropdown === "starred" && (
                            <div ref={dropdownRef} className="absolute top-full left-0 mt-4 z-30 w-[300px]">
                            <StarredDropDown />
                            </div>
                        )}
                    </div>
                    <div className="w-auto h-auto inline-block relative">
                        <div onClick={()=>setOpenDropdown(openDropdown === "create" ? null : "create")}
                            className={`px-2 py-1 ml-3 ${(onBoard)?`border-[1px] border-white hover:text-gray-700`:`primary-button`} rounded-md cursor-pointer flex items-center`}>
                            Create <FaPlus className="ml-2 text-lg" />
                        </div>

                        {openDropdown === "create" && (
                            <div ref={dropdownRef} className="absolute top-full left-0 mt-4 z-30 w-[300px]">
                            <CreateDropDown />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-auto h-full flex items-center">
                <div className="relative h-full flex items-center">
                    <div onClick={()=>{setShowNotifications(true)}} className={`relative w-auto h-auto text-2xl cursor-pointer ${(onBoard)?`text-white`:`text-gray-500`} hover:text-gray-700`}>
                        <IoNotifications />
                        {unreadCount>0  && (
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-sm font-semibold h-[18px] w-[18px] flex justify-center items-center rounded-full">
                            {unreadCount}
                            </div>
                        )}
                    </div>
                    {
                        (showNotifications) && <Notification setShowNotifications={setShowNotifications} />
                    }
                </div>
                <div className="relative h-full flex items-center ml-4">
                    <div onClick={()=>setOpenProfileNav(true)} className="h-8 w-8 flex items-center justify-center 
                    bg-blue-500 text-white font-semibold text-lg rounded-full cursor-pointer hover:shadow-[0px_4px_8px_rgba(12,12,13,0.3)]  ">
                    {(user)&&user.name[0].toUpperCase()}
                    </div>

                    {
                    (openProfileNav) &&
                    <ProfilePicNavBar setOpenProfileNav={setOpenProfileNav} />
                    }
                </div>
            </div>
        </div>
    </header>
  );
};

const WorkspaceDropDown = () => {
    const [workspaces,setWorkspaces] = useState([]);
    const [loading,setLoading] = useState(true);

    const fetchWorkspaces = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/workspace/`,
                {withCredentials: true}
            );
            
            setWorkspaces(response.data.workspaces);
        } catch (error) {
            console.log("Error while fetching workspaces - ",error)
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchWorkspaces()
    },[])


  return (
    <div className="max-w-[300px] w-full h-auto rounded-lg bg-white shadow-[0px_0px_10px_rgba(12,12,13,0.2)] z-30">
        <div className="w-full p-3 max-h-[90vh] overflow-y-auto">
        {
            (loading)?
            <div>Loading</div>:
            workspaces.map((workspace)=>(
                <Link to={`/workspace/${workspace.name.replace(/\s+/g, '')}/${workspace._id}/home`} key={workspace._id} 
                    className="w-full px-2 py-2 hover:bg-gray-100 rounded-md flex items-center cursor-pointer">
                    <div className="w-auto h-auto inline-block mr-4">
                    <span className="w-8 h-8 font-bold text-white bg-blue-300 rounded-md flex items-center justify-center ">
                        {workspace.name[0].toUpperCase()}
                    </span>
                    </div>
                    <div className="w-full font-semibold text-gray-700 line-clamp-1 ">
                        {workspace.name}
                    </div>
                </Link>
            ))
        }
        </div>
    </div>
  );
};

const StarredDropDown = ()=>{
    const [starredBoards,setStarredBoards] = useState([]);
    const [loadingStarredBoards,setLoadingStarredBoards] = useState(true);

    const fetchStarredBoards = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/board/starred-boards`,
                {withCredentials: true}
            );

            setStarredBoards(response.data.starredBoards)
        } catch (error) {
            console.log("Error while fetching starred boards - ",error)
        }
        finally{
            setLoadingStarredBoards(false)
        }
    }

    useEffect(()=>{
        fetchStarredBoards()
    },[])

    return(
    <div className="max-w-[300px] w-full h-auto rounded-lg bg-white shadow-[0px_0px_10px_rgba(12,12,13,0.2)] z-30">
        <div className="w-full p-3 max-h-[90vh] overflow-y-auto">
            {
                (loadingStarredBoards)
                ?
                <div>loading starred boards</div>
                :
                starredBoards.map((board)=>(
                    <Link to={`/board/${board.name.replace(/\s+/g, '')}/${board._id}`} key={board._id} className="w-full px-2 py-1.5 hover:bg-gray-100 rounded-md flex items-center cursor-pointer">
                        <div className="w-auto h-auto inline-block mr-4">
                        <span className="w-8 h-8 font-bold text-white rounded-md flex items-center justify-center" style={{background:board.background}}>
                            {board.name[0].toUpperCase()}
                        </span>
                        </div>
                        <div className="w-full text-gray-700 ">
                            <h1 className="font-semibold text-[14px]">{board.name}</h1>
                            <h3 className="text-[12px]  ">{board.workspace.name}</h3>
                        </div>
                    </Link>
                ))
            }
        </div>
    </div>
    )
}

const CreateDropDown = ()=>{
    const [creatingWorkspace,setCreatingworkspace] = useState(false);
    const [creatingBoard,setCreatingBoard] = useState(false);

    return(
    <div className="max-w-[300px] w-full h-auto rounded-lg bg-white text-gray-700 p-3 shadow-[0px_0px_10px_rgba(12,12,13,0.2)] z-30">
        <div onClick={()=>{setCreatingBoard(true)}} className="w-full px-2 py-2 hover:bg-gray-100 cursor-pointer rounded-md">
            <h1 className=" font-semibold text-[14px] flex items-center "> 
                <TbLayoutDashboardFilled className="mr-2 text-base " />Create Board
            </h1>
            <h3 className="text-xs text-gray-500">A board is made up of cards ordered on lists. Use it to manage and organize projects.</h3>
        </div>
        <div onClick={()=>{setCreatingworkspace(true)}} className="w-full px-2 py-2 hover:bg-gray-100 cursor-pointer rounded-md">
            <h1 className=" font-semibold text-[14px] flex items-center ">
                <RxDashboard className="mr-2 text-base " />Create Workspace
            </h1>
            <h3 className="text-xs text-gray-500">A workspace contains multiple boards and brings your team or projects together in one place.</h3>
        </div>

        {
        (creatingWorkspace)&& <CreateWorkspace setCreatingworkspace={setCreatingworkspace} />
        }
        {
        (creatingBoard)&& <CreateBoard setCreatingBoard={setCreatingBoard} />
        }
    </div>
    )
}

const ProfilePicNavBar = ({setOpenProfileNav})=>{
    const navRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (navRef.current && !navRef.current.contains(e.target)) {
            setOpenProfileNav(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
    <div ref={navRef} className="w-[90vw] h-[100vh] sm:w-[350px] sm:h-auto bg-white border-[1px] border-gray-300 shadow-[-2px_2px_10px_rgba(12,12,13,0.1)] rounded-lg z-40 absolute top-full -right-6">
        <div className=" w-full h-full px-3 py-4 ">
            <div className="w-full h-auto pb-6 border-b-[1px] border-gray-300 px-2">
                <h2 className="font-semibold text-gray-700 ">Account</h2>
                <div className="w-full flex items-start mt-3">
                    <div className="w-auto h-auto mr-4">
                        <div className="h-9 w-9 flex items-center justify-center bg-blue-500 text-white font-semibold text-lg rounded-full ">
                        P
                        </div>
                    </div>
                    <div>
                        <h1 className="text-gray-700 font-semibold break-words">Name</h1>
                        <h2 className="text-gray-500 break-words text-sm">email@gmail.com</h2>
                    </div>
                </div>
            </div>
            <div className="w-full h-full mt-2 space-y-2">
                <div className="px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                    <FaPlus className="mr-3" />Create Workspace
                </div>
                {/* <div className="block sm:hidden px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer ">
                    Create Board
                </div> */}
                <div className="sm:hidden px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                    <TbStar className="mr-3" />Starred Board
                </div>
                <div className="px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                    <IoSettingsOutline className="mr-3" />Settings
                </div>
                <div className="px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                    <MdOutlineLightMode className="mr-3" />Theme
                </div>
                <div className="pt-2 border-t-[1px] border-gray-300">
                    <div className="mt-2 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                        <FiLogOut className="mr-3" />Logout
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Header;
