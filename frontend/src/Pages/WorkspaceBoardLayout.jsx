import React, { useEffect, useState } from "react";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoPerson } from "react-icons/io5";
import { IoPersonAdd } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from 'axios'
import Workspace from "../Components/Workspace";
import Board from "../Components/Board";

const WorkspaceBoardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const contentType = location.pathname.split("/").pop() ;
    const { id, name } = useParams();

    const [workspace,setWorkspace] = useState({});

    const handleNavigation = (type)=>{
        navigate(`/workspace/${name}/${id}/${type}`);
    }

    const isActive = (type) => contentType === type;


    const fetchWorkspace = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/workspace/${name}/${id}`,
                {withCredentials: true}
            );

            // console.log(response.data.workspace)
            setWorkspace(response.data.workspace);
        } catch (error) {
            console.log("Error while fetching workspace - ",error)
        }
    }

    useEffect(()=>{
        fetchWorkspace()
    },[])


  return (
    <main className="w-full h-full ">
        <div className="w-full h-full  flex ">
            <div className="min-w-[20%] h-full border-r-[1px] border-gray-300 ">
                
                <div className="w-full h-14 px-2 py-1 border-b-[1px] border-gray-300 ">
                    <div className="w-full px-2 py-2 flex items-center ">
                        <div className="w-auto h-auto inline-block mr-4">
                            {
                            (workspace.name) &&
                            <span className="w-8 h-8 font-bold text-lg text-white bg-blue-300 rounded-md flex items-center justify-center ">
                            {workspace.name[0].toUpperCase()}
                            </span>
                            }
                        </div>
                        <div className="w-full font-semibold text-lg text-gray-500 flex items-center justify-between">
                            {(workspace.name) &&<div className=" line-clamp-1">{workspace.name}</div>}
                        </div>
                    </div>
                </div>
                <div className="w-full h-auto px-2 mt-4 ">
                    <div onClick={()=>{handleNavigation('')}} 
                        className={`my-2 px-2 py-1 flex items-center text-gray-500 hover:font-semibold hover:text-gray-600
                        hover:bg-gray-100 rounded-md cursor-pointer 
                        ${(contentType!=='members'&&contentType!=='settings')?"bg-gray-200 text-gray-600 font-semibold":""} `}>
                        <TbLayoutDashboardFilled className="mr-3 text-xl"/> Boards
                    </div>
                    <div onClick={()=>{handleNavigation('members')}}
                        className={`my-2 px-2 py-1 flex items-center text-gray-500 hover:font-semibold hover:text-gray-600
                        hover:bg-gray-100 rounded-md cursor-pointer ${isActive("members")?"bg-gray-200 text-gray-600 font-semibold":""} `}>
                        <IoPerson className="mr-3 text-xl"/> Members
                    </div>
                    <div className="my-2 px-2 py-1 flex items-center text-gray-500 hover:font-semibold hover:text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer ">
                        <IoPersonAdd className="mr-3 text-xl"/> Add member
                    </div>
                    <div onClick={()=>{handleNavigation('settings')}}
                        className={`my-2 px-2 py-1 flex items-center text-gray-500 hover:font-semibold hover:text-gray-600
                        hover:bg-gray-100 rounded-md cursor-pointer ${isActive("settings")?"bg-gray-200 text-gray-600 font-semibold":""} `}>
                        <IoMdSettings className="mr-3 text-xl"/> Settings
                    </div>
                </div>

            </div>
            <div className="h-full w-[80%]  ">
                <Workspace contentType={contentType} />
                {/* <Board /> */}
            </div>
        </div>
    </main>
  );
};




export default WorkspaceBoardLayout;
