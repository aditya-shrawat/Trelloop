import React from 'react'
import { TbStar } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";

const Board = () => {
  return (
    <div className='w-full h-full flex flex-col '>
        <div className="w-full h-14 px-4 p-1 border-b-[1px] border-gray-300 ">
            <div className="w-full px-2 py-2 flex justify-between items-center ">
                <div className='w-auto flex items-center'>
                    <h3 className='inline-block font-bold text-gray-600 text-xl'>borad name</h3>
                    <div className="ml-5 inline-block text-lg text-gray-600 hover:scale-110 hover:text-[#ffc300] cursor-pointer">
                        <TbStar />
                    </div>
                </div>
                <div className='w-auto' >
                    <div className='w-auto h-auto'>
                        <div className='h-8 w-8 rounded-full bg-blue-300 text-white font-semibold flex justify-center items-center'>
                            AS
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='flex-1 h-full overflow-auto'>
            <div className=' p-4 flex'>
                <div className='w-auto flex'>
                    {
                    [...Array(6)].map((_,index)=>(
                        <div key={index} className='w-60 p-2 mr-4 border-[1px] border-gray-300 rounded-xl '>
                            <div className='w-full p-1 mb-2 break-words font-semibold'>
                                List name
                            </div>
                            <div className='w-full px-1 py-2 hover:bg-gray-200 cursor-pointer rounded-xl flex items-center font-semibold text-gray-600'>
                                <IoMdAdd className='mr-3 text-xl' /> Add card
                            </div>
                        </div>
                    ))
                    }
                </div>
                <div className='min-w-60 h-10 hover:border-[3px] border-[2px] border-[#49C5C5] rounded-xl p-3 
                    cursor-pointer shadow-[0px_4px_8px_rgba(12,12,13,0.2)]'>
                    <div className='w-full h-full flex items-center font-semibold text-gray-600'>
                        <IoMdAdd className='mr-3 text-xl' /> Add new list
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Board