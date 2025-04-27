import React, { useEffect, useRef } from 'react'
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { GoCheckCircleFill } from "react-icons/go";
import { IoPerson } from "react-icons/io5";
import { IoPersonAdd } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { BsLayersFill } from "react-icons/bs";
import { CgDetailsMore } from "react-icons/cg";
import { TbListDetails } from "react-icons/tb";
import { BiEdit } from "react-icons/bi";
import { AiTwotoneCloseCircle } from "react-icons/ai";

const CardDetailsModel = ({cardId,setShowCardDetails}) => {
    const divref = useRef(null);


    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            setShowCardDetails(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


  return (
    <div className="w-screen h-screen overflow-x-hidden z-20 fixed top-0 left-0 bg-[rgba(0,0,0,0.75)] ">
        <div ref={divref} className=" max-w-[95%]  md:max-w-3xl w-full py-6
                absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:flex bg-white rounded-xl border-[1px] border-gray-300 ">
            
            <div onClick={()=>{setShowCardDetails(false)}} className=' rounded-full absolute text-gray-600 top-2 right-2 cursor-pointer'>
                <AiTwotoneCloseCircle className='text-2xl ' />
            </div>
            {/* Main content */}
            <div className="flex-1 p-6 ">
                {/* Header */}
                <div className="flex items-start ">
                    <GoCheckCircleFill className="w-5 h-5 mt-2 text-green-500" />
                    <div className="ml-3 w-full flex justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-600">Card name</h2>
                            <div className="text-sm text-gray-500 mt-1">
                                in list{" "}
                                <span className="bg-gray-100 px-2 py-0.5 rounded">
                                    List name 
                                </span>
                            </div>
                        </div>

                        <div className='w-auto '>
                            <div className=' text-gray-600 font-semibold px-2 py-0.5 cursor-pointer rounded-lg 
                                 hover:bg-gray-100 flex items-center '>
                                <BiEdit className='mr-2 text-lg' />
                                Edit card
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="flex my-4 ">
                    <CgDetailsMore className="text-lg mr-3 text-gray-600 mt-1" />
                    <div className="w-full ">
                        <h3 className="text-base font-medium text-gray-600 mb-2">Description</h3>
                        <p className="w-full text-gray-600">
                            Card description
                        </p>
                        {/* <textarea placeholder="Add a more detailed description..."
                            className="min-h-24 w-full p-2 border-[1px] border-gray-300 outline-none rounded-lg text-gray-600 bg-gray-50 hover:bg-gray-100 "
                        /> */}
                    </div>
                </div>

                {/* Activity */}
                <div className="">
                    <div className="flex items-center justify-between mb-4 ">
                        <div className="flex items-center gap-2">
                            <TbListDetails className="text-lg mr-2 text-gray-600" />
                            <h3 className="text-base font-medium text-gray-600">Activity</h3>
                        </div>
                    </div>

                    
                    <div className="w-full h-full ">
                        <div className="flex ">
                            <div className='h-auto w-auto mr-3'>
                                <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center">
                                    <span className=" font-semibold text-white">AS</span>
                                </div>
                            </div>
                            <input placeholder="Write a comment..." 
                                className="w-full px-2 py-1 border-[1px] border-gray-300 outline-none rounded-lg text-gray-600 bg-gray-50 hover:bg-gray-100 "
                            />
                        </div>

                        <div className='w-full flex mt-4'>
                            <div className='h-auto w-auto mr-3'>
                                <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center">
                                    <span className=" font-semibold text-white">PS</span>
                                </div>
                            </div>
                            <div className="w-full">
                                <div className='w-full felx mb-1'>
                                    <h3 className="font-semibold text-gray-600">Punit Shrawat</h3>
                                    <p className="text-xs text-gray-500">Apr 13, 2025, 10:21 AM</p>
                                </div>
                                <p className="text-sm text-gray-600 font-semibold">
                                    added this card to alskdjldsk
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="sm:w-52 mt-4 sm:mt-none p-6 sm:pr-6 sm:p-2
                    space-y-4 grid grid-cols-2 gap-x-4 sm:flex sm:flex-col ">
                <button className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                     flex items-center text-gray-600">
                    <IoPersonAdd className="text-lg mr-3" />
                    Add member
                </button>

                <button className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                     flex items-center text-gray-600">
                    <IoPerson className="text-lg mr-3" />
                    Members
                </button>

                <button className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                     flex items-center text-gray-600">
                    <FaRegCalendarAlt className="text-lg mr-3" />
                    Dates
                </button>

                <button className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                     flex items-center text-gray-600">
                    <GrAttachment className="text-lg mr-3" />
                    Attachment
                </button>

                <button className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                     flex items-center text-gray-600">
                    <BsLayersFill className="text-lg mr-3" />
                    Cover
                </button>
            </div>
        </div>
    </div>
  )
}

export default CardDetailsModel