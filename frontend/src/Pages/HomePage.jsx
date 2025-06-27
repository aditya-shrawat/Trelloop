import React, { useEffect, useState } from "react";
import { IoHome } from "react-icons/io5";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoMdArrowDropright } from "react-icons/io";
import Header from "../Components/Header";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import HomeMainContainer from "../Components/HomePage components/HomeMainContainer";
import MyBoards from "../Components/HomePage components/MyBoards";

const HomePage = () => {
  const [workspaces,setWorkspaces] = useState([]);
  const [loadingWorkspaces,setLoadingWorkspaces] = useState(true);

  const location = useLocation();
  const [route, setRoute] = useState(location.pathname);

  useEffect(() => {
    setRoute(location.pathname);
  }, [location.pathname]);

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

  useEffect(()=>{
    fetchWorkspaces()
  },[])


  return (
    <div className="w-full h-full min-h-screen overflow-y-auto">
      <Header />
      <main className="w-full h-full ">
        <div className="w-full h-full ">
          <div className="max-w-[1200px] w-full h-full m-auto flex flex-row ">

            <div className="hidden w-full sm:block max-w-[280px] h-full px-4 mt-8 ">
              <div className="w-full h-auto py-4 border-b-[1px] border-gray-300">
                <Link to={`/home`} className={`w-full px-2 py-2 flex items-center 
                      ${(route==='/home')?`text-[#49C5C5] bg-[#49C5C5]/20 backdrop-blur-xl`:`text-gray-500 hover:bg-gray-100`} 
                      text-lg font-semibold rounded-lg cursor-pointer`}>
                  <IoHome className="mr-4" /> Home
                </Link>
                <Link to={`/myBoards`} className={`w-full px-2 py-2 mt-3 flex items-center 
                      ${(route==='/myBoards')?`text-[#49C5C5] bg-[#49C5C5]/20 backdrop-blur-xl`:`text-gray-500 hover:bg-gray-100`}
                       text-lg font-semibold rounded-lg cursor-pointer`}>
                  <TbLayoutDashboardFilled className="mr-4" /> Boards
                </Link>
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
                        <div className="w-auto h-auto inline-block mr-3">
                          <span className="w-8 h-8 font-bold text-white bg-blue-300 rounded-md flex items-center justify-center ">
                            {workspace.name[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="w-full font-semibold flex items-center justify-between">
                          <div className="line-clamp-2 break-words">{workspace.name}</div> <div><IoMdArrowDropright className="ml-1 text-2xl"/></div>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              </div>
            </div>

            {route === "/home" && <HomeMainContainer />}
            {route === "/myBoards" && <MyBoards />}

          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;