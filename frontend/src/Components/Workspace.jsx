import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoPersonAdd } from "react-icons/io5";
import BoardSlide from "./WorkspaceComponents/BoardSlide";
import MembersSlide from "./WorkspaceComponents/MembersSlide";
import SettingsSlide from "./WorkspaceComponents/SettingsSlide";
import AddNewMembers from "./WorkspaceComponents/AddNewMembers";

const Workspace = ({contentType}) => {
    const { id, name } = useParams();
    const [workspace,setWorkspace] = useState();
    const [isAddingNewMembers,setIsAddingNewMembers] = useState(false)

    const fetchWorkspace = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
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


  return (
    <div className="h-auto w-full px-6 ">
        <div className="w-full h-auto px-2 py-6 flex justify-center border-b-[1px] border-gray-300 ">
            <div className="w-full max-w-[85%] flex justify-between items-center ">
                <div className="w-auto px-2 py-2 flex items-center ">
                    <div className="w-auto h-auto inline-block mr-6">
                    {workspace && 
                        <span className="w-14 h-14 font-bold text-3xl text-white bg-blue-300 rounded-md flex items-center justify-center ">
                        {workspace.name[0].toUpperCase()}
                        </span>
                    }
                    </div>
                    {workspace && 
                    <div className="w-full text-xl ">
                        <div className="font-semibold line-clamp-1 text-gray-700">
                        {workspace.name}
                        </div>
                        <div className=" text-[14px] text-gray-500">
                        {workspace.description}
                        </div>
                    </div>
                    }
                </div>
                <div>
                    <button onClick={()=>{setIsAddingNewMembers(true)}}
                        className="px-4 py-1 bg-[#49C5C5] hover:bg-[#5fcaca] hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] rounded-lg cursor-pointer
                        text-white font-semibold flex items-center">
                        <IoPersonAdd className="mr-3 text-lg" /> Invite workspace members
                    </button>
                </div>
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


