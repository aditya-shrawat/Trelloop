import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoPersonAdd } from "react-icons/io5";
import BoardSlide from "./WorkspaceComponents/BoardSlide";
import MembersSlide from "./WorkspaceComponents/MembersSlide";
import SettingsSlide from "./WorkspaceComponents/SettingsSlide";
import AddNewMembers from "./WorkspaceComponents/AddNewMembers";
import { useUser } from "../Contexts/UserContext";
import { RiLock2Line } from "react-icons/ri";
import { MdPublic } from "react-icons/md";

const Workspace = ({contentType}) => {
    const { id, name } = useParams();
    const [workspace,setWorkspace] = useState();
    const [isAddingNewMembers,setIsAddingNewMembers] = useState(false)
    const {user} = useUser();
    const navigate = useNavigate();
    const [isAdmin,setIsAdmin] = useState(false);

    const fetchWorkspace = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/workspace/${name}/${id}`,
                {withCredentials: true}
            );

            setWorkspace(response.data.workspace);
        } catch (error) {
            console.log("Error while fetching workspace - ",error)
            navigate("*");
        }
    }

    useEffect(()=>{
        fetchWorkspace()
    },[])

    useEffect(()=>{
        if(workspace && user && (user.id?.toString() === workspace.createdBy?.toString())){
            setIsAdmin(true);
        }
    },[workspace,user])

  return (
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
            ) : contentType === "settings" ? (
            <SettingsSlide workspace={workspace} setWorkspace={setWorkspace}/>
            ) : (
             <BoardSlide workspace={workspace} />
            )}
        </div>}
        {
          (isAddingNewMembers)&& <AddNewMembers setIsAddingNewMembers={setIsAddingNewMembers} workspace={{id,name}} />
        }
    </div>
  );
};

export default Workspace;


