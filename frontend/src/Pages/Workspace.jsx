import React, { useEffect, useState } from "react";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoPerson } from "react-icons/io5";
import { IoPersonAdd } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from 'axios'
import { TbListDetails } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import AddNewMembers from "../Components/WorkspaceComponents/AddNewMembers";
import BoardSlide from "../Components/WorkspaceComponents/BoardSlide";
import WorkspaceActivity from "../Components/WorkspaceComponents/WorkspaceActivity";
import SettingsSlide from "../Components/WorkspaceComponents/SettingsSlide";
import MembersSlide from "../Components/WorkspaceComponents/MembersSlide";
import { useUser } from "../Contexts/UserContext";
import { RiLock2Line } from "react-icons/ri";
import { MdPublic } from "react-icons/md";

const Workspace = () => {
    const location = useLocation();
    const contentType = location.pathname.split("/").pop() ; //last segment of the URL path
    const { id, name } = useParams();
    const [workspace,setWorkspace] = useState();

    const [isAddingNewMembers,setIsAddingNewMembers] = useState(false)
    const {user} = useUser();
    const navigate = useNavigate();
    const [isAdmin,setIsAdmin] = useState();
    const [isMember, setIsMember] = useState();

    const isActive = (type) => contentType === type;


    const fetchWorkspace = async ()=>{
        const BackendURL = import.meta.env.VITE_BackendURL;
        try {
            const response = await axios.get(`${BackendURL}/workspace/${name}/${id}`,
                {withCredentials: true}
            );

            setWorkspace(response.data.workspace);
        } catch (error) {
            console.log("Error while fetching workspace - ",error)
        }
    }

    useEffect(()=>{
        fetchWorkspace()
    },[])

    useEffect(() => {
        if (workspace && user) {
            const userId = user.id?.toString();
            const creatorId = workspace.createdBy?.toString();

            setIsAdmin(userId === creatorId);

            const isUserMember = workspace.members?.some(
                member => member.toString() === userId
            );

            setIsMember(isUserMember);
        }
    }, [contentType,workspace,user]);


    useEffect(()=>{
        if(contentType !== "members" && contentType !== "settings" && contentType !== "activity" && contentType !== "home" ){
            navigate("*")
        }

        if ((workspace && isAdmin!==undefined && isMember!==undefined) && (contentType === "settings" && workspace?.isPrivate === false && !isAdmin && !isMember)){
            navigate("*");
        }
    },[contentType, workspace, isAdmin, isMember])


  return (
    <main className="w-full h-full ">
        <div className="w-full h-full  flex ">
            {/* Side nav bar */}
            <div className="w-full px-4 hidden sm:block max-w-[280px] lg:max-w-80 h-full border-r-[1px] border-gray-300 ">
                <div className="w-full min-h-14 ">
                    <div className="px-1 py-2 text-gray-700 text-sm font-semibold">Workspace</div>
                    <div className="w-full h-auto flex items-center rounded-md border-[1px] border-gray-300">
                        <div className="w-full px-2 py-2 flex items-center  ">
                            <div className="w-auto h-auto inline-block mr-2">
                                {
                                (workspace) &&
                                <span className="w-8 h-8 font-bold text-lg text-white bg-blue-300 rounded-md flex items-center justify-center ">
                                {workspace.name[0].toUpperCase()}
                                </span>
                                }
                            </div>
                            <div className="w-full font-semibold text-lg text-gray-700 flex items-center justify-between">
                                {(workspace) &&<div className=" line-clamp-2">{workspace.name}</div>}
                            </div>
                        </div>
                        <div className="text-gray-700 text-lg p-2 "><IoIosArrowDown /></div>
                    </div>
                </div>
                <div className="w-full h-auto mt-4 ">
                    {workspace &&
                    <> 
                    <Link to={`/workspace/${workspace.name.replace(/\s+/g, '')}/${workspace._id}/home`} 
                        className={`my-2 px-2 py-1 flex items-center font-semibold rounded-md cursor-pointer 
                        ${(contentType==='home')?"text-[#49C5C5] border-[1px] border-[#49C5C5] bg-[#49C5C5]/20 backdrop-blur-xl":
                        "text-gray-700 hover:bg-gray-100"} `}>
                        <TbLayoutDashboardFilled className="mr-3 text-xl"/> Boards
                    </Link>
                    <Link to={`/workspace/${workspace.name.replace(/\s+/g, '')}/${workspace._id}/members`}
                        className={`my-2 px-2 py-1 flex items-center font-semibold rounded-md cursor-pointer 
                        ${isActive("members")?"text-[#49C5C5] border-[1px] border-[#49C5C5] bg-[#49C5C5]/20 backdrop-blur-xl":
                        "text-gray-700 hover:bg-gray-100"} `}>
                        <IoPerson className="mr-3 text-xl"/> Members
                    </Link>
                    <Link to={`/workspace/${workspace.name.replace(/\s+/g, '')}/${workspace._id}/activity`} 
                        className={`my-2 px-2 py-1 flex items-center font-semibold rounded-md cursor-pointer 
                        ${isActive("activity")?"text-[#49C5C5] border-[1px] border-[#49C5C5] bg-[#49C5C5]/20 backdrop-blur-xl":
                        "text-gray-700 hover:bg-gray-100"} `}>
                        <TbListDetails className="mr-3 text-xl"/> Activity
                    </Link>
                    {(isAdmin || isMember) && 
                        (<Link to={`/workspace/${workspace.name.replace(/\s+/g, '')}/${workspace._id}/settings`} 
                            className={`my-2 px-2 py-1 flex items-center font-semibold rounded-md cursor-pointer 
                            ${isActive("settings")?"text-[#49C5C5] border-[1px] border-[#49C5C5] bg-[#49C5C5]/20 backdrop-blur-xl":
                            "text-gray-700 hover:bg-gray-100"} `}>
                            <IoMdSettings className="mr-3 text-xl"/> Settings
                        </Link>)
                    }
                    </>
                    }
                </div>
            </div>
            {/* Main content */}
            <div className="h-auto w-full px-4 sm:px-6 ">
                <div className="w-full h-auto px-2 py-6 flex justify-center border-b-[1px] border-gray-300 ">
                    <div className="w-full md:max-w-[85%] flex justify-between items-center ">
                        <div className="w-auto flex flex-col">
                            <div className="flex items-center ">
                                <div className="w-auto h-auto inline-block mr-4">
                                {workspace && 
                                    <span className="w-14 h-14 font-bold text-3xl text-white bg-blue-300 rounded-md flex items-center justify-center ">
                                    {workspace.name[0].toUpperCase()}
                                    </span>
                                }
                                </div>
                                {(workspace && workspace.name ) && 
                                <div className="w-full text-xl ">
                                    <div className="font-semibold line-clamp-1 text-gray-700">
                                        {workspace.name}
                                    </div>
                                    {
                                    (workspace.isPrivate)?
                                    (<div className='text-gray-500 text-xs flex items-center'>
                                        <RiLock2Line className='mr-1' />Private
                                    </div>)
                                    :
                                    (<div className='text-gray-500 text-xs flex items-center'>
                                        <MdPublic className='mr-1' />Public
                                    </div>)
                                    }
                                </div>
                                }
                            </div>
                            {
                            (workspace && workspace.description) &&
                            <div className="mt-2 text-[14px] text-gray-500">
                                {workspace.description}
                            </div>
                            }
                        </div>
                        {
                        (isAdmin) &&
                        <div className=" hidden md:block">
                            <button onClick={()=>{setIsAddingNewMembers(true)}}
                                className="px-4 py-1 ml-4 bg-[#49C5C5] hover:bg-[#5fcaca] hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] rounded-lg cursor-pointer
                                text-white font-semibold flex items-center">
                                <div><IoPersonAdd className="mr-2 text-base" /></div> Invite members
                            </button>
                        </div>
                        }
                    </div>
                </div>
                {(workspace && workspace._id) && 
                    <div className="h-auto w-full px-2 py-6 ">
                        {contentType === "members" ? (
                            <MembersSlide />
                        ) : (contentType === "settings" && (isAdmin || isMember)) ? (
                            <SettingsSlide isAdmin={isAdmin} isMember={isMember} workspace={workspace} setWorkspace={setWorkspace}/>
                        ) : contentType === "activity" ? (
                            <WorkspaceActivity />
                        ) : contentType === "home" ? (
                            <BoardSlide isAdmin={isAdmin} isMember={isMember} />
                        ) : (
                            null
                        )}
                    </div>
                }
            </div>
            {
                (isAddingNewMembers)&& <AddNewMembers setIsAddingNewMembers={setIsAddingNewMembers} workspace={{id,name}} />
            }
        </div>
    </main>
  );
};

export default Workspace;
