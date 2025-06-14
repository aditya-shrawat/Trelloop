import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoMdArrowDropright } from "react-icons/io";
import Header from "../Components/Header";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [workspaces,setWorkspaces] = useState([]);
  const [starredBoards,setStarredBoards] = useState([]);
  const [loadingWorkspaces,setLoadingWorkspaces] = useState(true);
  const [loadingStarredBoards,setLoadingStarredBoards] = useState(true);

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
      setLoadingWorkspaces(false)
    }
  }

  const fetchStarredBoards = async ()=>{
    try {
      const BackendURL = import.meta.env.VITE_BackendURL;
      const response = await axios.get(`${BackendURL}/board/starred`,
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
    fetchWorkspaces()
    fetchStarredBoards()
  },[])


  return (
    <div className="w-full h-full min-h-screen overflow-y-auto">
      <Header />
      <main className="w-full h-full ">
        <div className="w-full h-full ">
          <div className="max-w-[1200px] h-full m-auto flex flex-row ">

            <div className=" max-w-[25%] w-full h-full px-4 mt-10 ">
              <div className="w-full h-auto py-4 border-b-[1px] border-gray-300">
                <div className="w-full px-2 py-2 flex items-center text-[#49C5C5] text-lg font-semibold rounded-lg bg-[#49C5C5]/20 backdrop-blur-xl cursor-pointer">
                  <IoHome className="mr-4" /> Home
                </div>
                <div className="w-full px-2 py-2 mt-3 flex items-center text-gray-500 hover:bg-gray-100 text-lg font-semibold rounded-lg cursor-pointer">
                  <TbLayoutDashboardFilled className="mr-4" /> Boards
                </div>
              </div>

              <div className="w-full h-full mt-4 py-4 ">
                <h3 className="text-gray-500 font-semibold text-[14px] px-2">Workspaces</h3>
                <div className="w-full h-auto mt-4">
                  {
                    (loadingWorkspaces)?
                    <div>loadingWorkspaces</div>:
                    workspaces.map((workspace)=>(
                      <Link to={`/workspace/${workspace.name.replaceAll(" ","")}/${workspace._id}`} key={workspace._id} 
                        className="w-full px-2 py-2 my-2 hover:bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer ">
                        <div className="w-auto h-auto inline-block mr-4">
                          <span className="w-8 h-8 font-bold text-white bg-blue-300 rounded-md flex items-center justify-center ">
                            {workspace.name[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="w-full font-semibold flex items-center justify-between">
                          <div className=" line-clamp-1">{workspace.name}</div> <div><IoMdArrowDropright className="ml-1 text-2xl"/></div>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              </div>
            </div>

            <div className=" max-w-[50%] w-full min-h-full px-4 border-x-[1px] border-gray-300 bg-pink-100">
            </div>

            <div className=" max-w-[25%] w-full h-full px-4 mt-10">
              <div className="w-full h-auto py-4 border-b-[1px] border-gray-300">
                <h3 className="text-gray-500 font-semibold text-[14px] px-2">Starred</h3>
                <div className="w-full h-full mt-4 ">
                  {
                    (loadingStarredBoards)
                    ?
                    <div>loading starred boards</div>
                    :
                    starredBoards.map((board)=>(
                    <Link to={`/board/${board.name.replaceAll(" ","")}/${board._id}`} key={board._id} className="w-full px-2 py-2 my-2 hover:bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer ">
                      <div className="w-auto h-auto inline-block mr-4">
                        <span className="w-8 h-8 font-bold text-white bg-blue-300 rounded-md flex items-center justify-center ">
                          {board.name[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="w-full ">
                        <h1 className="font-semibold text-[14px]">{board.name}</h1>
                        <h3 className="text-[12px] text-gray-500 ">{board.workspace.name}</h3>
                      </div>
                    </Link>
                  ))
                  }
                </div>
              </div>

              <div className="w-full h-auto py-4 ">
                <h3 className="text-gray-500 font-semibold text-[14px] px-2">Joined Boards</h3>
                <div className="w-full h-full mt-4 ">
                  {
                    [...Array(3)].map((_,index)=>(
                      <div key={index} className="w-full px-2 py-2 my-2 hover:bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer ">
                        <div className="w-auto h-auto inline-block mr-4">
                          <span className="w-8 h-8 font-bold text-white bg-blue-300 rounded-md flex items-center justify-center ">
                            W
                          </span>
                        </div>
                        <div className="w-full ">
                          <h1 className="font-semibold text-[14px]">Board name</h1>
                          <h3 className="text-[12px] text-gray-500 ">Workspace 1</h3>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* <div className="w-full px-2 py-2 mt-6 hover:bg-gray-100 border-[1px] border-gray-300 rounded-lg flex items-center cursor-pointer ">
                <div className="w-8 h-8 mr-4 text-xl flex items-center justify-center text-gray-500">
                  <FaPlus  />
                </div>
                <div className="w-full text-gray-500 font-semibold ">
                  Create Board
                </div>
              </div> */}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;