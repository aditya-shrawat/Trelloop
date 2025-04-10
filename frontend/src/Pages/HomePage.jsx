import React from "react";
import { FaPlus } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoMdArrowDropright } from "react-icons/io";
import Header from "../Components/Header";

const HomePage = () => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Header />
      <main className="w-full h-full ">
        <div className="w-full h-full ">
          <div className="max-w-[1200px] h-full m-auto flex flex-row ">

            <div className=" max-w-[25%] w-full h-full px-4 pt-14 ">
              <div className="w-full h-auto pt-4 pb-6 border-b-[1px] border-gray-300">
                <div className="w-full px-2 py-2 flex items-center text-[#49C5C5] text-lg font-semibold rounded-lg bg-[#49C5C5]/20 backdrop-blur-xl cursor-pointer">
                  <IoHome className="mr-4" /> Home
                </div>
                <div className="w-full px-2 py-2 mt-3 flex items-center text-gray-400 hover:bg-gray-100 text-lg font-semibold rounded-lg cursor-pointer">
                  <TbLayoutDashboardFilled className="mr-4" /> Boards
                </div>
              </div>

              <div className="w-full h-auto pt-6 pb-4 ">
                <h3 className="text-gray-500 font-semibold text-[14px] px-2">Workspaces</h3>
                <div className="w-full h-full mt-4 ">
                  {
                  [...Array(4)].map((index)=>(
                    <div className="w-full px-2 py-2 my-2 hover:bg-gray-100 rounded-lg flex items-center cursor-pointer ">
                      <div className="w-auto h-auto inline-block mr-4">
                        <span className="w-8 h-8 font-bold text-white bg-blue-300 rounded-md flex items-center justify-center ">
                          W
                        </span>
                      </div>
                      <div className="w-full font-semibold text-gray-500 flex items-center justify-between">
                        Workspace 1 <IoMdArrowDropright className="ml-1 text-2xl"/>
                      </div>
                    </div>
                  ))
                  }
                </div>
              </div>
            </div>

            <div className=" max-w-[50%] w-full h-full px-4 border-x-[1px] border-gray-300 bg-pink-100">
            </div>

            <div className=" max-w-[25%] w-full h-full px-4 pt-14">
              <div className="w-full h-auto py-4 border-b-[1px] border-gray-300">
                <h3 className="text-gray-500 font-semibold text-[14px] px-2">Starred</h3>
                <div className="w-full h-full mt-4 ">
                  {
                  [...Array(3)].map((index)=>(
                    <div className="w-full px-2 py-2 my-2 hover:bg-gray-100 rounded-lg flex items-center cursor-pointer ">
                      <div className="w-auto h-auto inline-block mr-4">
                        <span className="w-8 h-8 font-bold text-white bg-blue-300 rounded-md flex items-center justify-center ">
                          W
                        </span>
                      </div>
                      <div className="w-full text-gray-500 ">
                        <h1 className="font-semibold text-[14px]">Board name</h1>
                        <h3 className="text-[12px]  ">Workspace 1</h3>
                      </div>
                    </div>
                  ))
                  }
                </div>
              </div>

              <div className="w-full h-auto py-4 border-b-[1px] border-gray-300">
                <h3 className="text-gray-500 font-semibold text-[14px] px-2">Joined Boards</h3>
                <div className="w-full h-full mt-4 ">
                  {
                    [...Array(3)].map((index)=>(
                      <div className="w-full px-2 py-2 my-2 hover:bg-gray-100 rounded-lg flex items-center cursor-pointer ">
                        <div className="w-auto h-auto inline-block mr-4">
                          <span className="w-8 h-8 font-bold text-white bg-blue-300 rounded-md flex items-center justify-center ">
                            W
                          </span>
                        </div>
                        <div className="w-full text-gray-500 ">
                          <h1 className="font-semibold text-[14px]">Board name</h1>
                          <h3 className="text-[12px]  ">Workspace 1</h3>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="w-full px-2 py-2 mt-6 hover:bg-gray-100 border-[1px] border-gray-300 rounded-lg flex items-center cursor-pointer ">
                <div className="w-8 h-8 mr-4 text-xl flex items-center justify-center text-gray-500">
                  <FaPlus  />
                </div>
                <div className="w-full text-gray-500 font-semibold ">
                  Create Board
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;