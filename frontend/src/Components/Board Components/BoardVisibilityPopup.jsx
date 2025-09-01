import React from 'react'
import { useState } from 'react';
import { RiLock2Line } from "react-icons/ri";
import { MdPublic } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { BsPersonWorkspace } from "react-icons/bs";
import { useApi } from '../../../api/useApi';

const BoardVisibilityPopup = ({board,setBoard,setVisibilityPopup})=>{
    const [errorMsg,setErrorMsg] = useState("")
    const api = useApi();


    const changeBoardVisibility = async (newVisibility)=>{
        if(newVisibility.trim()===''){
            return ;
        }

        try {
            const response = await api.post(`/board/${board._id}/visibility`,{newVisibility});

            setBoard(response.data.board)
        } catch (error) {
            console.log("Error while changing board visibility - ",error)
            setErrorMsg("Something went wrong!")
        }
    }


    return (
        <div className='bg-white h-auto w-full p-4 rounded-lg '>
            <div className='w-full h-full  '>
                <div className='w-full text-start mb-2'>
                    <h1 className='text-lg font-semibold text-gray-700 flex items-center'>
                        <span onClick={()=>setVisibilityPopup(false)} className='cursor-pointer p-1 mr-1'><IoIosArrowBack /></span> 
                        Change visibility
                    </h1>
                </div>
                <div className='w-full space-y-2'>
                    <div onClick={()=>{changeBoardVisibility('Workspace')}} className={`w-full p-2 cursor-pointer hover:bg-gray-100 rounded-lg ${(board.visibility==='Workspace')?`border-2 border-teal-500`:`border-none`}`}>
                        <div className='text-gray-700 font-semibold flex items-center'>
                            <BsPersonWorkspace className='mr-2' />Workspace
                        </div>
                        <p className='text-gray-400 text-sm'>
                            All the members of the <span className='font-semibold'>{board.workspace.name}</span> workspace can see and edit this board.
                        </p>
                    </div>
                    <div onClick={()=>{changeBoardVisibility('Private')}} className={`w-full p-2 cursor-pointer hover:bg-gray-100 rounded-lg ${(board.visibility==='Private')?`border-2 border-teal-500`:`border-none`}`}>
                        <div className='text-gray-700 font-semibold flex items-center'>
                            <RiLock2Line className='mr-2' />Private
                        </div>
                        <p className='text-gray-400 text-sm'>
                            Only board members and workspace admin can see and edit this board.
                         </p>
                    </div>
                    <div onClick={()=>{changeBoardVisibility('Public')}} className={`w-full p-2 cursor-pointer hover:bg-gray-100 rounded-lg ${(board.visibility==='Public')?`border-2 border-teal-500`:`border-none`}`}>
                        <div className='text-gray-700 font-semibold flex items-center'>
                            <MdPublic className='mr-2' />Public
                        </div>
                        <p className='text-gray-400 text-sm'>
                            Anyone on the internet can see this board. Only board members and workspace members can edit.
                        </p>
                    </div>
                </div>
                {   (errorMsg.trim()!=="") &&
                    <div className='text-red-600 text-sm mt-2'>
                    {errorMsg}
                    </div>
                }
            </div>
        </div>
    )
}

export default BoardVisibilityPopup