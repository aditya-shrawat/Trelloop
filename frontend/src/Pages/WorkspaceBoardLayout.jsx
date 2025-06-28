import React, { useEffect, useState } from "react";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoPerson } from "react-icons/io5";
import { IoPersonAdd } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from 'axios'
import Workspace from "../Components/Workspace";
import Board from "../Components/Board";

const WorkspaceBoardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const contentType = location.pathname.split("/").pop() ; //last segment of the URL path
    const { id, name } = useParams();
    const [showBoard,setShowBoard] = useState(null)
    const [loading,setLoading] = useState(true)

    const [workspace,setWorkspace] = useState();

    const path = useLocation().pathname ;
    const whatToShow = ()=>{
        try {
            if(path.includes('workspace')){
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
            <div className="w-full hidden sm:block max-w-[280px] h-full border-r-[1px] border-gray-300 ">
                
                <div className="w-full min-h-14 px-2 py-1 border-b-[1px] border-gray-300 ">
                    <div className="w-full px-2 py-2 flex items-center ">
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
                </div>
                <div className="w-full h-auto px-2 mt-4 ">
                    {workspace &&
                    <> 
                    <Link to={`/workspace/${workspace.name.replaceAll(" ","")}/${workspace._id}`} 
                        className={`my-2 px-2 py-1 flex items-center text-gray-500 hover:font-semibold hover:text-gray-700
                        hover:bg-gray-100 rounded-md cursor-pointer 
                        ${(contentType!=='members'&&contentType!=='settings')?"bg-gray-200 text-gray-700 font-semibold":""} `}>
                        <TbLayoutDashboardFilled className="mr-3 text-xl"/> Boards
                    </Link>
                    <Link to={`/workspace/${workspace.name.replaceAll(" ","")}/${workspace._id}/members`}
                        className={`my-2 px-2 py-1 flex items-center text-gray-500 hover:font-semibold hover:text-gray-700
                        hover:bg-gray-100 rounded-md cursor-pointer ${isActive("members")?"bg-gray-200 text-gray-700 font-semibold":""} `}>
                        <IoPerson className="mr-3 text-xl"/> Members
                    </Link>
                    <div className="my-2 px-2 py-1 flex items-center text-gray-500 hover:font-semibold hover:text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer ">
                        <IoPersonAdd className="mr-3 text-xl"/> Add member
                    </div>
                    <Link to={`/workspace/${workspace.name.replaceAll(" ","")}/${workspace._id}/settings`} 
                        className={`my-2 px-2 py-1 flex items-center text-gray-500 hover:font-semibold hover:text-gray-700
                        hover:bg-gray-100 rounded-md cursor-pointer ${isActive("settings")?"bg-gray-200 text-gray-700 font-semibold":""} `}>
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
