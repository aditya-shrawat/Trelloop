import React, { useEffect, useState } from "react";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoPerson } from "react-icons/io5";
import { IoPersonAdd } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from 'axios'
import Workspace from "../Components/Workspace";
import Board from "../Components/Board";
import { TbListDetails } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";

const WorkspaceBoardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const contentType = location.pathname.split("/").pop() ; //last segment of the URL path
    const { id, name } = useParams();
    const [showBoard,setShowBoard] = useState(null)
    const [loading,setLoading] = useState(true)

    const [workspace,setWorkspace] = useState();

    const path = location.pathname ;
    const whatToShow = ()=>{
        try {
            if(path.split("/")[1] === 'workspace'){
                setShowBoard(false);
            }
            else{
                setShowBoard(true) ;
            }
        } catch (error) {
            console.log("Error") ;
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        whatToShow()
    },[path])

    const isActive = (type) => contentType === type;


    const fetchWorkspace = async ()=>{
        const BackendURL = import.meta.env.VITE_BackendURL;
        let workspaceId = id;
        let workspaceName = name;

        if(location.pathname.split("/")[1] === 'board'){
            try {
                const response = await axios.get(`${BackendURL}/board/${id}/workspace-info`,
                    {withCredentials: true}
                );

                workspaceName=response.data.workspace.name;
                workspaceId=response.data.workspace._id;
            } catch (error) {
                console.log("Error while fetching workspace via board , -",error)
                return;
            }
        }

        try {
            const response = await axios.get(`${BackendURL}/workspace/${workspaceName}/${workspaceId}`,
                {withCredentials: true}
            );

            setWorkspace(response.data.workspace);
        } catch (error) {
            console.log("Error while fetching workspace - ",error)
        }
    }

    useEffect(()=>{
        fetchWorkspace()
        whatToShow()
    },[])


  return (
    <main className="w-full h-full ">
        <div className="w-full h-full  flex ">
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
                    <Link to={`/workspace/${workspace.name.replaceAll(" ","")}/${workspace._id}/home`} 
                        className={`my-2 px-2 py-1 flex items-center font-semibold rounded-md cursor-pointer 
                        ${(contentType==='home')?"text-[#49C5C5] border-[1px] border-[#49C5C5] bg-[#49C5C5]/20 backdrop-blur-xl":
                        "text-gray-700 hover:bg-gray-100"} `}>
                        <TbLayoutDashboardFilled className="mr-3 text-xl"/> Boards
                    </Link>
                    <Link to={`/workspace/${workspace.name.replaceAll(" ","")}/${workspace._id}/members`}
                        className={`my-2 px-2 py-1 flex items-center font-semibold rounded-md cursor-pointer 
                        ${isActive("members")?"text-[#49C5C5] border-[1px] border-[#49C5C5] bg-[#49C5C5]/20 backdrop-blur-xl":
                        "text-gray-700 hover:bg-gray-100"} `}>
                        <IoPerson className="mr-3 text-xl"/> Members
                    </Link>
                    <Link to={`/workspace/${workspace.name.replaceAll(" ","")}/${workspace._id}/activity`} 
                        className={`my-2 px-2 py-1 flex items-center font-semibold rounded-md cursor-pointer 
                        ${isActive("activity")?"text-[#49C5C5] border-[1px] border-[#49C5C5] bg-[#49C5C5]/20 backdrop-blur-xl":
                        "text-gray-700 hover:bg-gray-100"} `}>
                        <TbListDetails className="mr-3 text-xl"/> Activity
                    </Link>
                    <Link to={`/workspace/${workspace.name.replaceAll(" ","")}/${workspace._id}/settings`} 
                        className={`my-2 px-2 py-1 flex items-center font-semibold rounded-md cursor-pointer 
                        ${isActive("settings")?"text-[#49C5C5] border-[1px] border-[#49C5C5] bg-[#49C5C5]/20 backdrop-blur-xl":
                        "text-gray-700 hover:bg-gray-100"} `}>
                        <IoMdSettings className="mr-3 text-xl"/> Settings
                    </Link>
                    </>
                    }
                </div>

            </div>
            <div className="h-full w-full  ">
                {
                (loading)?
                <div className="h-full w-full bg-red-300">Loading....</div>
                :
                (showBoard)?
                <Board setWorkspace={setWorkspace} />
                :
                <Workspace contentType={contentType} />
                }
            </div>
        </div>
    </main>
  );
};




export default WorkspaceBoardLayout;
