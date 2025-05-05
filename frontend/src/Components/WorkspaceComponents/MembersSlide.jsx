import React from 'react'
import { RxCross2 } from "react-icons/rx";

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
                    className="px-1 py-[0.5px] rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 border-[1px] border-gray-300 
                          hover:text-gray-700 text-gray-500 font-semibold flex items-center ">
                    <RxCross2 className="mr-1 text-lg" /> Remove
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default MembersSlide