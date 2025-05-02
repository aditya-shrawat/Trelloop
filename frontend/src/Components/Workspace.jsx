import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TbStar } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { IoPersonAdd } from "react-icons/io5";
import CreateBoard from "./CreateBoard";

const Workspace = ({contentType}) => {
    const { id, name } = useParams();
    const [workspace,setWorkspace] = useState();

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
                    <button
                    className="px-4 py-1 bg-[#49C5C5] hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] rounded-lg cursor-pointer
                    text-white font-semibold flex items-center">
                    <IoPersonAdd className="mr-3 text-lg" /> Invite workspace members
                    </button>
                </div>
            </div>
        </div>
        <div className="h-auto w-full px-2 pt-6 ">
            {contentType === "members" ? (
            <MembersSlide />
            ) : contentType === "settings" ? (
            <SettingsSlide />
            ) : (
             (workspace && workspace._id) && <BoardSlide workspace={workspace} workspaceId={workspace._id} />
            )}
        </div>
    </div>
  );
};

export default Workspace;

const BoardSlide = ({workspace, workspaceId}) => {
    const [creatingBoard,setCreatingBoard] = useState(false);
    const [boards,setBoards] = useState();
    const [loading,setLoading] = useState(true);

    const fetchBoards =async ()=>{
      try {
        const BackendURL = import.meta.env.VITE_BackendURL;
        const response = await axios.get(`${BackendURL}/board/${workspace._id}/boards`,
          {withCredentials: true}
        );

        setBoards(response.data.boards)
      } catch (error) {
        console.log("Error while fetching blogs - ",error)
      }
      finally{
        setLoading(false)
      }
    }

    useEffect(()=>{
      if(workspaceId){
        fetchBoards()
      }
    },[workspaceId])


  return (
    <div className="w-full h-auto ">
      <h2 className="text-xl font-semibold text-gray-700">Boards</h2>
      <div className="w-full h-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ">
        <div onClick={()=>{setCreatingBoard(true)}}
          className="min-w-44 max-w-56 h-24 p-3 rounded-lg hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] 
                cursor-pointer relative bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex justify-center items-center border-[1px] border-gray-300 ">
          <h3 className="font-semibold ">Create board</h3>
        </div>
        {(loading)?
        <div>Loading...</div>
        :
        boards.map((board) => (
          <Link to={`/board/${board.name.replaceAll(" ","")}/${board._id}`} key={board._id}
            className="min-w-44 max-w-56 h-24 p-3 rounded-lg hover:shadow-[0px_4px_8px_rgba(12,12,13,0.3)] cursor-pointer relative bg-green-400 ">
            <h3 className="font-bold text-white">{board.name}</h3>
            <div className="inline-block text-xl text-white absolute bottom-3 right-3 hover:scale-115 hover:text-[#ffc300]">
              <TbStar />
            </div>
          </Link>
        ))
        }
      </div>
      {
        (creatingBoard)&& <CreateBoard setCreatingBoard={setCreatingBoard} workspaceName={workspace.name} 
                            workspaceID={workspace._id} />
      }
    </div>
  );
};

const MembersSlide = () => {
  return (
    <div className="w-full h-auto">
      <div className="pb-6 border-b-[1px] border-gray-300 ">
        <h2 className="text-xl font-semibold text-gray-700">{`Workspace members (6)`}</h2>
        <h2 className="text-base text-gray-500 mt-2">
          Workspace members can view and join all Workspace visible boards and
          create new boards in the Workspace.
        </h2>
      </div>
      <div className="mt-4 w-full h-auto ">
        {[...Array(6)].map((_, index) => (
          <div key={index}
            className="w-full py-4 border-b-[1px] border-gray-300 flex items-center">
            <div className=" mr-4">
              <div className="w-10 h-10 rounded-full bg-blue-300 font-semibold text-base text-white flex justify-center items-center">
                AS
              </div>
            </div>
            <div className="w-full h-auto flex justify-between items-center">
              <div className="w-full h-auto">
                <h2 className="font-semibold text-gray-700">Aditya shrawat</h2>
                <h2 className="text-gray-500 text-[14px]">@adityashrawat</h2>
              </div>
              <div className="w-auto h-auto inline-block ">
                <div
                  className="px-2 py-1 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 border-[1px] border-gray-300 
                        hover:text-gray-700 text-gray-500 font-semibold flex items-center ">
                  <RxCross2 className="mr-2 text-xl" /> Remove
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsSlide = () => {
  return (
    <div className="w-full h-auto">
      <h2 className="text-xl font-semibold text-gray-700">Workspace settings</h2>
      <div className="w-full pb-10 h-auto mt-6">
        <div className="w-[50%]  border-gray-300 ">
          <div className="w-full flex flex-col font-semibold ">
            <label className="text-gray-700">Name</label>
            <input
              type="text" placeholder="Workspace name"
              className="p-2 mt-2 border-[1px] text-gray-700 border-gray-300 rounded-lg outline-none"/>
          </div>
          <div className="w-full mt-6 flex flex-col font-semibold ">
            <label className="text-gray-700">Description</label>
            <textarea
              placeholder="Workspace description"
              className="p-2 mt-2 border-[1px] text-gray-700 border-gray-300 rounded-lg outline-none"/>
          </div>
          <div className="w-full mt-8 flex ">
            <div>
              <button className="px-6 py-1 cursor-pointer bg-[#49C5C5] font-semibold text-white rounded-lg">
                Save
              </button>
            </div>
            <div className="ml-10">
              <button className="px-6 py-1 cursor-pointer border-[1px] text-gray-700 border-gray-300 hover:bg-gray-100 font-semibold rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-10 border-t-[1px] border-gray-300">
        <div className=" inline-block px-3 py-2 border-[1px] border-red-500 text-red-500 cursor-pointer hover:font-semibold rounded-lg">
          Delete this Workspace ?
        </div>
      </div>
    </div>
  );
};
