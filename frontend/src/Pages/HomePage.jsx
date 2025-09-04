import React, { useEffect, useState } from "react";
import { IoHome } from "react-icons/io5";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoMdArrowDropright } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import HomeMainContainer from "../Components/HomePage components/HomeMainContainer";
import MyBoards from "../Components/HomePage components/MyBoards";
import TrackDeadlines from "../Components/HomePage components/TrackDeadlines";
import { TbCalendarClock } from "react-icons/tb";
import BottomNavigation from "../Components/BottomNavigation";
import MyWorkspaces from "../Components/MyWorkspaces";
import { useApi } from "../../api/useApi";
import { registerUserSocket } from "../Socket/socketService";
import socket from "../Socket/socket";
import { useUser } from "../Contexts/UserContext";

const HomePage = () => {
  const [workspaces,setWorkspaces] = useState([]);
  const [loadingWorkspaces,setLoadingWorkspaces] = useState(true);
  const api = useApi();
  const user = useUser()

  const location = useLocation();
  const [route, setRoute] = useState(location.pathname);

  useEffect(() => {
    setRoute(location.pathname);
  }, [location.pathname]);

  const fetchWorkspaces = async ()=>{
    try {
      const response = await api.get('/workspace/');

      setWorkspaces(response.data.workspaces);
    } catch (error) {
      console.log("Error while fetching workspaces - ",error)
    }
    finally{
      setLoadingWorkspaces(false)
    }
  }

  useEffect(()=>{
    fetchWorkspaces()
  },[])

  // register user socket
  useEffect(() => {
    if(!socket || !user._id) return;

    registerUserSocket(socket, user._id);
  }, [socket, user._id]);

  //socket handlers
  useEffect(() => {
    if (!socket) return;

    const handler = (data) => setWorkspaces((w) => [data.newWorkspace, ...w]);
    socket.on("workspace_created", handler);

    return () => {
      socket.off("workspace_created", handler);
    };
  }, []);

  return (
      <main className="w-full h-full min-h-screen relative">

        <BottomNavigation  />

          <div className="max-w-[800px] lg:max-w-7xl w-full h-fit m-auto flex flex-row pt-4 pb-20 sm:py-8">

            <div className="hidden w-full sm:block max-w-[240px] md:max-w-[300px] h-full px-4">
              <div className="w-full h-auto py-4 border-b-[1px] border-gray-300 text-gray-700">
                <Link to={`/home`} className={`w-full px-2 py-2 flex items-center 
                      ${(route==='/home')?`text-teal-600 border-[1px] border-teal-600 bg-[#49C5C5]/20 backdrop-blur-xl`:` hover:bg-gray-100`} 
                      text-lg font-semibold rounded-lg cursor-pointer`}>
                  <IoHome className="mr-3" /> Home
                </Link>
                <Link to={`/myBoards`} className={`w-full px-2 py-2 mt-3 flex items-center 
                      ${(route==='/myBoards')?`text-teal-600 border-[1px] border-teal-600 bg-[#49C5C5]/20 backdrop-blur-xl`:` hover:bg-gray-100`}
                       text-lg font-semibold rounded-lg cursor-pointer`}>
                  <TbLayoutDashboardFilled className="mr-3" /> Boards
                </Link>
                <Link to={`/deadlines`} className={`w-full px-2 py-2 mt-3 flex items-center 
                      ${(route==='/deadlines')?`text-teal-600 border-[1px] border-teal-600 bg-[#49C5C5]/20 backdrop-blur-xl`:` hover:bg-gray-100`}
                       text-lg font-semibold rounded-lg cursor-pointer`}>
                  <TbCalendarClock className="mr-3" />Deadlines
                </Link>
              </div>

              <div className="w-full h-full mt-4 py-4 ">
                <h3 className="text-gray-500 font-semibold text-[14px] px-2">Workspaces</h3>
                <div className="w-full h-auto mt-2">
                  {
                    (loadingWorkspaces)?
                      (<div>loadingWorkspaces</div>)
                      :
                    (workspaces && workspaces.length!==0)?
                      workspaces?.map((workspace)=>(
                        (<Link to={`/workspace/${workspace.name.replace(/\s+/g, '')}/${workspace._id}/home`} key={workspace._id} 
                          className="w-full px-2 py-2 my-2 hover:bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer ">
                          <div className="w-auto h-auto inline-block mr-3">
                            <span className="w-8 h-8 font-bold text-white bg-blue-300 rounded-md flex items-center justify-center ">
                              {workspace.name[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="w-full font-semibold flex items-center justify-between">
                            <div className="line-clamp-2 break-words">{workspace.name}</div> <div><IoMdArrowDropright className="ml-1 text-2xl"/></div>
                          </div>
                        </Link>)
                      ))
                    :
                      (<div className='w-full px-2'>
                        <div className='text-gray-400 text-sm'>
                          Create or join a workspace to get started.
                        </div>
                      </div>)
                  }
                </div>
              </div>
            </div>

            {route === "/home" && <HomeMainContainer />}
            {route === "/myBoards" && <MyBoards />}
            {route === "/deadlines" && <TrackDeadlines />}
            {route === "/myWorkspaces" && <MyWorkspaces />}

          </div>
      </main>
  );
};

export default HomePage;