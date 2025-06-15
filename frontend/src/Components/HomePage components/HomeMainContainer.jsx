import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import { Link } from "react-router-dom";
import HomeContent from "./HomeContent";

const HomeMainContainer = () => {
  const [starredBoards, setStarredBoards] = useState([]);
  const [loadingStarredBoards, setLoadingStarredBoards] = useState(true);

  const fetchStarredBoards = async () => {
    try {
      const BackendURL = import.meta.env.VITE_BackendURL;
      const response = await axios.get(`${BackendURL}/board/starred`, {
        withCredentials: true,
      });

      setStarredBoards(response.data.starredBoards);
    } catch (error) {
      console.log("Error while fetching starred boards - ", error);
    } finally {
      setLoadingStarredBoards(false);
    }
  };

  useEffect(() => {
    fetchStarredBoards();
  }, []);

  return (
    <div className="flex w-full  mt-8">
      <div className=" flex-1 min-h-[400px] pl-4 md:pl-8 pr-4 lg:pr-8 ">
        <HomeContent />
      </div>

      <div className="hidden lg:block min-w-[280px] h-full px-4">
        <div className="w-full h-auto py-4 border-b-[1px] border-gray-300">
          <h3 className="text-gray-500 font-semibold text-[14px] px-2">
            Starred
          </h3>
          <div className="w-full h-full mt-4 ">
            {loadingStarredBoards ? (
              <div>loading starred boards</div>
            ) : (
              starredBoards.map((board) => (
                <Link to={`/board/${board.name.replaceAll(" ", "")}/${board._id}`} key={board._id}
                  className="w-full px-2 py-2 my-2 hover:bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer "
                >
                  <div className="w-auto h-auto inline-block mr-4">
                    <span className="w-8 h-8 font-bold text-white bg-blue-300 rounded-md flex items-center justify-center ">
                      {board.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="w-full ">
                    <h1 className="font-semibold text-[14px]">{board.name}</h1>
                    <h3 className="text-[12px] text-gray-500 ">
                      {board.workspace.name}
                    </h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="w-full h-auto py-4 ">
          <h3 className="text-gray-500 font-semibold text-[14px] px-2">
            Joined Boards
          </h3>
          <div className="w-full h-full mt-4 ">
            {[...Array(3)].map((_, index) => (
              <div key={index}
                className="w-full px-2 py-2 my-2 hover:bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer ">
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
            ))}
          </div>
        </div>

        {/* <div className="w-full px-2 py-2 mt-6 hover:bg-gray-100 border-[1px] border-gray-300 rounded-lg flex items-center cursor-pointer ">
                <div className="w-8 h-8 mr-4 text-xl flex items-center justify-center text-gray-500">
                  <FaPlus  />
                </div>
                <div className="w-full text-gray-500 font-semibold ">
                  Create Board
                </div>
            </div> 
        */}
      </div>
    </div>
  );
};

export default HomeMainContainer;
