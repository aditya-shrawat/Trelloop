import React, { useEffect, useRef, useState } from 'react'
import { TbStar } from "react-icons/tb";
import { TbStarFilled } from "react-icons/tb";
import { TbListDetails } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsPersonWorkspace } from "react-icons/bs";
import { MdOutlineVisibility } from "react-icons/md";

const BoardOptionMenu = ({setShowBoardOptions})=>{
    const navRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (navRef.current && !navRef.current.contains(e.target)) {
            setShowBoardOptions(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return (
        <div ref={navRef} className="w-70 sm:w-[350px] h-auto bg-white shadow-[0px_0px_10px_rgba(12,12,13,0.3)] rounded-lg absolute top-5 right-4  ">
            <div className=" w-full h-full px-3 py-4 ">
                <div className="w-full h-full space-y-1 ">
                    <div className="p-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center ">
                        <div className='mr-3 text-amber-400 text-lg'><TbStarFilled/></div> Star
                    </div>
                    <div className="p-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                        <div className='mr-3 text-lg'><div className='h-4 w-4 bg-red-400 rounded-sm'></div></div>Change background
                    </div>
                    <div className="p-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                        <div className='mr-3 text-lg'><TbListDetails/></div> Activity
                    </div>
                </div>
                <div className="w-full h-auto py-3 border-t-[1px] border-gray-300 px-2 mt-2">
                    <div className='text-gray-700 mb-3'>
                        <div className="font-semibold flex items-center"><div className='mr-3 text-lg'><BsPersonWorkspace/></div>Workspace</div>
                        <h3 className='break-words text-gray-500 text-sm'>Name</h3>
                    </div>
                    <div className='text-gray-700'>
                        <div className="font-semibold flex items-center"><div className='mr-3 text-lg'><MdOutlineVisibility/></div>Visibility</div>
                        <h3 className='text-sm text-gray-500'>Any member of this workspace can view and edit this board.</h3>
                    </div>
                </div>
                <div className="pt-3 border-t-[1px] border-gray-300">
                    <div className="p-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                        <div className='mr-3 text-lg'><RiDeleteBin6Line/></div> Delete board
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BoardOptionMenu