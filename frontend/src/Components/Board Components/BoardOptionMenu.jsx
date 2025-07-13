import React, { useEffect, useRef, useState } from 'react'
import { TbStar } from "react-icons/tb";
import { TbStarFilled } from "react-icons/tb";
import { TbListDetails } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsPersonWorkspace } from "react-icons/bs";
import { MdOutlineVisibility } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BoardActivity from './BoardActivity';
import { IoPerson } from "react-icons/io5";
import BoardMembers from './BoardMembers';
import BoardVisibilityPopup from './BoardVisibilityPopup';
import { FiEdit } from "react-icons/fi";

const BoardOptionMenu = ({board,setBoard,starStatus,toggleStarStatus,setShowBoardOptions,UserRole})=>{
    const navRef = useRef(null);
    const [DeletePopup,setDeletePopup] = useState(false)
    const [VisibilityPopup,setVisibilityPopup] = useState(false)
    const [showActivity,setShowActivity] = useState(false);
    const [showMembers,setShowMembers] = useState(false);
    const [showRenamePopup,setShowRenamePopup] = useState(false)

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
        <div ref={navRef} className="w-full max-w-[300px] sm:max-w-[370px] h-auto bg-white shadow-[0px_0px_10px_rgba(12,12,13,0.3)] rounded-lg absolute top-5 right-6  ">
            {(VisibilityPopup )?
            (<BoardVisibilityPopup board={board} setBoard={setBoard} setVisibilityPopup={setVisibilityPopup} />)
            :
            (showActivity)?
            (<BoardActivity boardId={board._id} setShowActivity={setShowActivity} />)
            :
            (showMembers)?
            (<BoardMembers boardId={board._id} setShowMembers={setShowMembers} />)
            :
            (<div className=" w-full h-auto px-3 py-4 ">
                <div className="w-full space-y-1 ">
                    <div onClick={toggleStarStatus} className="p-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center ">
                        <div className='mr-3 text-lg'>{
                            (!starStatus)?
                            <div className='text-gray-700'><TbStar /></div>
                            :
                            <div className='text-[#ffc300]'><TbStarFilled /></div>
                        }</div> Star
                    </div>
                    {(board && (UserRole.isBoardMember || UserRole.isWorkspaceMember || UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin)) &&
                    (<div className="pt-3 mt-3 border-t-[1px] border-gray-300 relative">
                        <div onClick={()=>{setShowRenamePopup(true)}} className="p-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                            <div className='mr-3 text-lg'><FiEdit/></div> Change Title
                        </div>
                        {
                            showRenamePopup && <RenamePopup boardId={board._id} boardName={board.name} setShowRenamePopup={setShowRenamePopup} setBoard={setBoard} />
                        }
                    </div>)}
                    {(board && (UserRole.isBoardMember || UserRole.isWorkspaceMember || UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin)) &&
                    (<div className="p-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                        <div className='mr-3 text-lg'><div className='h-4 w-4 bg-red-400 rounded-sm'></div></div>Change background
                    </div>)}
                    <div  onClick={()=>{setShowMembers(true)}}
                            className="p-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                        <div className='mr-3 text-lg'><IoPerson/></div> Members
                    </div>
                    <div onClick={()=>{setShowActivity(true)}} 
                            className="p-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                        <div className='mr-3 text-lg'><TbListDetails/></div> Activity
                    </div>
                </div>
                <div className="w-full h-auto pt-3 border-t-[1px] border-gray-300 mt-2">
                    <div className='p-2 text-gray-700 '>
                        <div className="font-semibold flex items-center"><div className='mr-3 text-lg'><BsPersonWorkspace/></div>Workspace</div>
                        <h3 className='break-words text-gray-500 text-sm'>{board.workspace.name}</h3>
                    </div>
                    <div onClick={()=>{if(UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin){setVisibilityPopup(true)}}} 
                            className={`p-2 text-gray-700 flex items-center ${(UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin)&&`hover:bg-gray-100 rounded-md cursor-pointer`}`}>
                        <div className="font-semibold flex items-center"><div className='mr-3 text-lg'><MdOutlineVisibility/></div>Visibility: </div>
                        <h3 className='text-sm text-gray-500 ml-1'>{board.visibility}</h3>
                    </div>
                </div>
                {(board && (UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin)) &&
                (<div className="pt-3 mt-3 border-t-[1px] border-gray-300 relative">
                    <div onClick={()=>{setDeletePopup(true)}} className="p-2 font-semibold text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                        <div className='mr-3 text-lg'><RiDeleteBin6Line/></div> Delete board
                    </div>
                    {
                        DeletePopup && <DeleteBoardPopup boardId={board._id} setDeletePopup={setDeletePopup}  />
                    }
                </div>)}
            </div>)
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
        <div ref={divref} className='bg-white h-fit w-[330px] sm:w-[400px] px-4 py-6 rounded-lg border-[1px] border-gray-300 
                absolute bottom-12 -right-6 shadow-[0px_0px_12px_rgba(12,12,13,0.3)] z-10'>
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


const RenamePopup = ({boardId,boardName,setShowRenamePopup,setBoard})=>{
    const divref = useRef();
    const [errorMsg,setErrorMsg] = useState("")
    const [newName,setNewName] = useState(boardName?boardName:"");


    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            setShowRenamePopup(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInput = (e)=>{
        e.preventDefault();

        setNewName(e.target.value)
    }

    const renameBoard = async (e)=>{
        e.preventDefault();

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.patch(`${BackendURL}/board/${boardId}/re-name`,
                {newName},
            {withCredentials: true}
            );

            setBoard((prev) => ({ ...prev, name:newName }));
            setShowRenamePopup(false)
        } catch (error) {
            console.log("Error while renaming board - ",error)
            setErrorMsg("Something went wrong!")
        }
    }


    return (
        <div ref={divref} className='bg-white h-fit w-[330px] sm:w-[400px] px-4 py-6 rounded-lg border-[1px] border-gray-300 
                absolute top-full -right-6 shadow-[0px_0px_12px_rgba(12,12,13,0.3)] z-10'>
            <div className='w-full h-full  '>
                <div className='w-full text-start'>
                    <h1 className='text-lg font-semibold text-gray-700'>Rename Board</h1>
                    <p className='text-sm mt-1 text-gray-600'>Only the board title will be updated. Board data will remain unchanged.</p>
                </div>
                <div className='w-full text-start mt-4'>
                    <label className='text-sm font-semibold text-gray-700' >New title</label>
                    <input type="text"  onChange={handleInput} value={newName}
                        placeholder='Enter list name'
                        className='w-full px-2 py-1 mt-1 text-gray-700 border-[1px] border-gray-300 outline-none rounded-lg ' />
                </div>
                {   (errorMsg.trim()!=="") &&
                    <div className='text-red-600 text-sm mt-2'>
                    {errorMsg}
                    </div>
                }
                <div className='w-full flex justify-between md:justify-between items-center mt-6'>
                    <button onClick={renameBoard} className='w-[45%] py-1 bg-[#49C5C5] rounded-lg text-white font-semibold cursor-pointer outline-none'>
                        Rename
                    </button>
                    <button onClick={()=>{setShowRenamePopup(false)}} className='w-[45%] py-1 rounded-lg hover:bg-gray-50 text-gray-700 border-[1px] border-gray-300 cursor-pointer outline-none'>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}