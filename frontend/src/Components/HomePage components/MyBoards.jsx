import React from 'react'
import { TbStar } from "react-icons/tb";
import { TbStarFilled } from "react-icons/tb";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoPerson } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";

const MyBoards = () => {
  return (
    <div className='w-full p-4 md:pl-8 mt-4 sm:mt-8 '>
        <div className='w-full h-full'>
            <div className='w-full mb-7'>
                <h1 className='text-base font-bold text-gray-700'>YOUR WORKSPACES</h1>
            </div>

            <div className='w-full h-auto '>
            {[...Array(4)].map((_, index) => ( 
                <div key={index} className='w-full h-auto mb-9'>
                    <div className='w-full flex items-center justify-between '>
                        <div className="w-full text-gray-700 flex items-center ">
                            <div className="w-auto h-auto inline-block mr-3">
                                <span className="w-8 h-8 font-bold text-white bg-blue-300 rounded-md flex items-center justify-center ">
                                    W
                                </span>
                            </div>
                            <div className="w-full font-semibold">
                                <div className=" line-clamp-2 break-words">Workspace name</div>
                            </div>
                        </div>
                        <WorkspaceNavigators />
                    </div>

                    <div className="w-full h-auto mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-4 ">
                        {[...Array(3)].map((_, index) => ( 
                            <div key={index} className="min-w-24 w-full lg:max-w-56 h-28 p-3 rounded-lg hover:shadow-[0px_4px_8px_rgba(12,12,13,0.3)] cursor-pointer relative bg-green-400 ">
                                <h3 className="font-bold text-white line-clamp-2">Board name</h3>
                                <div className="inline-block text-xl absolute bottom-3 right-3 ">
                                    {
                                    (true)?
                                    <div className='text-white hover:scale-115 hover:text-[#ffc300]'>
                                        <TbStar />
                                    </div>
                                    :
                                    <div className='hover:scale-115 text-[#ffc300]'>
                                        <TbStarFilled />
                                    </div>
                                    }
                                </div>
                            </div>
                        ))
                        }
                    </div>
                </div>
            ))
            }
            </div>

        </div>
    </div>
  )
}

export default MyBoards


const WorkspaceNavigators = ()=>{
    const [show,setShow] = useState(false)
    const divRef = useRef();

    const showNavigators = ()=>{
        setShow(true);
    }

    useEffect(()=>{
        const handleOutsideClick = (e)=>{
            if( divRef.current && !divRef.current.contains(e.target) ){
                setShow(false);
            }
        }

        document.addEventListener('mousedown',handleOutsideClick) ;

        return ()=>{
            document.removeEventListener('mousedown',handleOutsideClick)
        }
    },[]);

    return (
        <div className='w-fit h-full '>
            <div className='w-full h-full hidden lg:flex items-center'>
                <div className='w-auto h-full px-2 py-1 ml-2 text-sm text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 
                        rounded-sm cursor-pointer flex items-center'>
                    <div className='mr-2'><TbLayoutDashboardFilled /></div>
                    Bords
                </div>
                <div className='w-auto h-full px-2 py-1 ml-2 text-sm text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 
                        rounded-sm cursor-pointer flex items-center'>
                    <div className='mr-2'><IoPerson /></div>
                    Members
                </div>
                <div className='w-auto h-full px-2 py-1 ml-2 text-sm text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 
                        rounded-sm cursor-pointer flex items-center'>
                    <div className='mr-2'><IoMdSettings /></div>
                    Settings
                </div>
            </div>

            <div className='w-auto h-full block lg:hidden relative'>
                <div onClick={showNavigators} className='w-fit h-full p-[0.5px] ml-2 text-lg cursor-pointer'>
                    <BsThreeDotsVertical />
                </div>

                { (show) &&
                <div ref={divRef} className='w-56 h-auto bg-white shadow-[0px_0px_8px_rgba(12,12,13,0.3)] border-[1px] border-gray-300 
                    rounded-md space-y-1 py-4 px-2 flex flex-col absolute top-[130%] right-0 z-20 '>
                    <div className='w-auto h-full px-2 py-1 text-gray-700 font-semibold  
                            rounded-sm cursor-pointer flex items-center'>
                        <div className='mr-3'><TbLayoutDashboardFilled /></div>
                        Bords
                    </div>
                    <div className='w-auto h-full px-2 py-1 text-gray-700 font-semibold 
                            rounded-sm cursor-pointer flex items-center'>
                        <div className='mr-3'><IoPerson /></div>
                        Members
                    </div>
                    <div className='w-auto h-full px-2 py-1 text-gray-700 font-semibold 
                            rounded-sm cursor-pointer flex items-center'>
                        <div className='mr-3'><IoMdSettings /></div>
                        Settings
                    </div>
                </div>
                }
            </div>

        </div>
    )
}