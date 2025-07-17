import React, { useEffect, useRef, useState } from 'react'
import { RxCross2 } from "react-icons/rx";

const MembersList = ({onClose,members}) => {
    const divref = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            onClose();
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


  return (
    <div ref={divref} className='bg-white h-fit w-72 sm:w-80 px-4 py-4 rounded-lg border-[1px] border-gray-300 
            absolute bottom-[130%] sm:top-[130%] right-0 shadow-[0px_0px_12px_rgba(12,12,13,0.3)] z-10 '>
        <div className='w-full'>
            <h3 className='pb-2 text-gray-700 font-semibold border-b-[1px] border-gray-300'>Card members</h3>
            <div className='w-full max-h-80 overflow-auto'>
                {
                (members.length ===0) ?
                <div className='w-full py-5 text-center text-gray-500 font-semibold'>NO members !!</div> 
                :
                members?.map((member)=>(
                    <div key={member._id} className="w-full py-2 border-b-[1px] border-gray-300 flex items-center">
                        <div className=" mr-3">
                            <div className="w-8 h-8 rounded-full bg-blue-300 font-semibold text-lg text-white flex justify-center items-center">
                                {(member.name) && (member.name[0].toUpperCase())}
                            </div>
                        </div>
                        <div className="w-full h-auto flex justify-between items-center">
                            <div className="w-full h-auto">
                                <h2 className="font-semibold text-gray-700 flex items-baseline">{`${member.name}`}</h2>
                                <h2 className="text-gray-500 text-xs">@username</h2>
                            </div>
                            <div className="w-auto h-auto inline-block ">
                                <div className="text-base p-1 flex items-center justify-center cursor-pointer "><RxCross2 /></div>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    </div>
  )
}

export default MembersList