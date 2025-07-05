import React, { useEffect, useRef, useState } from 'react'
import { TbStar } from "react-icons/tb";
import { TbStarFilled } from "react-icons/tb";
import { TbListDetails } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsPersonWorkspace } from "react-icons/bs";
import { MdOutlineVisibility } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RiLock2Line } from "react-icons/ri";
import { MdPublic } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";

const BoardOptionMenu = ({board,setBoard,starStatus,toggleStarStatus,setShowBoardOptions})=>{
    const navRef = useRef(null);
    const [DeletePopup,setDeletePopup] = useState(false)
    const [VisibilityPopup,setVisibilityPopup] = useState(false)

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
        <div ref={navRef} className="w-72 sm:w-[350px] h-auto bg-white shadow-[0px_0px_10px_rgba(12,12,13,0.3)] rounded-lg absolute top-5 right-6  ">
            {(!VisibilityPopup)?
            (<div className=" w-full h-full px-3 py-4 ">
                <div className="w-full h-full space-y-1 ">
                    <div onClick={toggleStarStatus} className="p-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center ">
                        <div className='mr-3 text-lg'>{
                            (!starStatus)?
                            <div className='text-gray-700'><TbStar /></div>
                            :
                            <div className='text-[#ffc300]'><TbStarFilled /></div>
                        }</div> Star
                    </div>
                    <div className="p-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                        <div className='mr-3 text-lg'><div className='h-4 w-4 bg-red-400 rounded-sm'></div></div>Change background
                    </div>
                    <div className="p-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                        <div className='mr-3 text-lg'><TbListDetails/></div> Activity
                    </div>
                </div>
                <div className="w-full h-auto py-3 border-t-[1px] border-gray-300 mt-2">
                    <div className='p-2 text-gray-700 '>
                        <div className="font-semibold flex items-center"><div className='mr-3 text-lg'><BsPersonWorkspace/></div>Workspace</div>
                        <h3 className='break-words text-gray-500 text-sm'>{board.workspace.name}</h3>
                    </div>
                    <div onClick={()=>{setVisibilityPopup(true)}} className='p-2 text-gray-700 flex items-center hover:bg-gray-100 rounded-md cursor-pointer'>
                        <div className="font-semibold flex items-center"><div className='mr-3 text-lg'><MdOutlineVisibility/></div>Visibility: </div>
                        <h3 className='text-sm text-gray-500 ml-1'>{board.visibility}</h3>
                    </div>
                </div>
                <div className="pt-3 border-t-[1px] border-gray-300 relative">
                    <div onClick={()=>{setDeletePopup(true)}} className="p-2 font-semibold text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                        <div className='mr-3 text-lg'><RiDeleteBin6Line/></div> Delete board
                    </div>
                    {
                        DeletePopup && <DeleteBoardPopup boardId={board._id} setDeletePopup={setDeletePopup}  />
                    }
                </div>
            </div>)
            :
            (<BoardVisibilityPopup board={board} setBoard={setBoard} setVisibilityPopup={setVisibilityPopup} />)
            }
        </div>
    )
}

export default BoardOptionMenu


const DeleteBoardPopup = ({boardId,setDeletePopup})=>{
    const divref = useRef();
    const [errorMsg,setErrorMsg] = useState("")
    const navigate = useNavigate()


    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            setDeletePopup(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const deleteBoard = async (e)=>{
        e.preventDefault();

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.delete(`${BackendURL}/board/${boardId}/delete`,
            {withCredentials: true}
            );

            console.log("board deleted successfully.")
            setDeletePopup(false)
            navigate(-1)
        } catch (error) {
            console.log("Error while deleting board - ",error)
            setErrorMsg("Something went wrong!")
        }
    }


    return (
        <div ref={divref} className='bg-white h-fit w-[300px] sm:w-[360px] px-4 py-6 rounded-lg border-[1px] border-gray-300 
                absolute bottom-12 -right-4 shadow-[0px_0px_12px_rgba(12,12,13,0.3)] z-10'>
            <div className='w-full h-full  '>
                <div className='w-full text-start'>
                    <h1 className='text-lg font-semibold text-gray-700'>Delete Board</h1>
                    <p className='text-sm mt-1 text-gray-600'>This will permanently delete the board and all its data. This action cannot be undone.</p>
                </div>
                {   (errorMsg.trim()!=="") &&
                    <div className='text-red-600 text-sm mt-2'>
                    {errorMsg}
                    </div>
                }
                <div className='w-full flex justify-between md:justify-between items-center mt-6'>
                    <button onClick={deleteBoard} className='w-[45%] py-1 bg-red-600 rounded-lg text-white font-semibold cursor-pointer outline-none'>
                        Delete
                    </button>
                    <button onClick={()=>{setDeletePopup(false)}} className='w-[45%] py-1 rounded-lg hover:bg-gray-50 text-gray-700 border-[1px] border-gray-300 cursor-pointer outline-none'>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}


const BoardVisibilityPopup = ({board,setBoard,setVisibilityPopup})=>{
    const [errorMsg,setErrorMsg] = useState("")


    const changeBoardVisibility = async (newVisibility)=>{
        if(newVisibility.trim()===''){
            return ;
        }

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.post(`${BackendURL}/board/${board._id}/visibility`,{newVisibility},
            {withCredentials: true}
            );

            setBoard(response.data.board)
        } catch (error) {
            console.log("Error while changing board visibility - ",error)
            setErrorMsg("Something went wrong!")
        }
    }


    return (
        <div className='bg-white h-fit w-full p-4 rounded-lg '>
            <div className='w-full h-full  '>
                <div className='w-full text-start mb-2'>
                    <h1 className='text-lg font-semibold text-gray-700 flex items-center'>
                        <span onClick={()=>setVisibilityPopup(false)} className='cursor-pointer p-1 mr-1'><IoIosArrowBack /></span> 
                        Change visibility
                    </h1>
                </div>
                <div className='w-full space-y-2'>
                    <div onClick={()=>{changeBoardVisibility('Workspace')}} className={`w-full p-2 cursor-pointer hover:bg-gray-100 rounded-lg ${(board.visibility==='Workspace')?`border-2 border-[#49C5C5]`:`border-none`}`}>
                        <div className='text-gray-700 font-semibold flex items-center'>
                            <BsPersonWorkspace className='mr-2' />Workspace
                        </div>
                        <p className='text-gray-500 text-sm'>
                            All the members of the <span className='font-semibold'>{board.workspace.name}</span> workspace can see and edit this board.
                        </p>
                    </div>
                    <div onClick={()=>{changeBoardVisibility('Private')}} className={`w-full p-2 cursor-pointer hover:bg-gray-100 rounded-lg ${(board.visibility==='Private')?`border-2 border-[#49C5C5]`:`border-none`}`}>
                        <div className='text-gray-700 font-semibold flex items-center'>
                            <RiLock2Line className='mr-2' />Private
                        </div>
                        <p className='text-gray-500 text-sm'>
                            Only board members and workspace admin can see and edit this board.
                         </p>
                    </div>
                    <div onClick={()=>{changeBoardVisibility('Public')}} className={`w-full p-2 cursor-pointer hover:bg-gray-100 rounded-lg ${(board.visibility==='Public')?`border-2 border-[#49C5C5]`:`border-none`}`}>
                        <div className='text-gray-700 font-semibold flex items-center'>
                            <MdPublic className='mr-2' />Public
                        </div>
                        <p className='text-gray-500 text-sm'>
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