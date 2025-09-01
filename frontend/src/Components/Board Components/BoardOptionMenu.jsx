import React, { useEffect, useRef, useState } from 'react'
import { TbStar } from "react-icons/tb";
import { TbStarFilled } from "react-icons/tb";
import { TbListDetails } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsPersonWorkspace } from "react-icons/bs";
import { MdOutlineVisibility } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import BoardActivity from './BoardActivity';
import { IoPerson } from "react-icons/io5";
import BoardMembers from './BoardMembers';
import BoardVisibilityPopup from './BoardVisibilityPopup';
import { FiEdit } from "react-icons/fi";
import ChangeBoardBg from './ChangeBoardBg';
import { useApi } from '../../../api/useApi';

const BoardOptionMenu = ({board,setBoard,starStatus,setBoardBg,toggleStarStatus,setShowBoardOptions,UserRole})=>{
    const navRef = useRef(null);
    const [DeletePopup,setDeletePopup] = useState(false)
    const [VisibilityPopup,setVisibilityPopup] = useState(false)
    const [showActivity,setShowActivity] = useState(false);
    const [showMembers,setShowMembers] = useState(false);
    const [showRenamePopup,setShowRenamePopup] = useState(false)
    const [isChangingBg,setIsChangingBg] = useState(false)

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
        <div ref={navRef} className="w-[300px] sm:w-[370px] h-auto bg-white shadow-[0px_0px_10px_rgba(12,12,13,0.3)] rounded-lg absolute top-11 right-0 z-40 ">
            {(VisibilityPopup )?
            (<BoardVisibilityPopup board={board} setBoard={setBoard} setVisibilityPopup={setVisibilityPopup} />)
            :
            (showActivity)?
            (<BoardActivity boardId={board._id} setShowActivity={setShowActivity} />)
            :
            (showMembers)?
            (<BoardMembers boardId={board._id} setShowMembers={setShowMembers} />)
            :
            (isChangingBg)?
            (<ChangeBoardBg boardId={board._id} currentBg={board.background} setBoardBg={setBoardBg} setIsChangingBg={setIsChangingBg} />)
            :
            (<div className="w-full h-auto px-3 py-4 ">
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
                    (<div onClick={()=>{setIsChangingBg(true)}}
                            className="p-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                        <div className='mr-3 text-lg'><div className='h-4 w-4 rounded-sm' style={{background:board.background}}></div></div>Change background
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
    const api = useApi();


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
            const response = await api.delete(`/board/${boardId}/delete`);
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
                absolute bottom-12 -right-6 shadow-[0px_0px_12px_rgba(12,12,13,0.2)] z-10'>
            <div className='w-full h-full  '>
                <div className='w-full text-start'>
                    <h1 className='text-lg font-semibold text-gray-700'>Delete Board</h1>
                    <p className='text-sm text-gray-400'>This will permanently delete the board and all its data. This action cannot be undone.</p>
                </div>
                {   (errorMsg.trim()!=="") &&
                    <div className='text-red-600 text-sm mt-2'>
                    {errorMsg}
                    </div>
                }
                <div className='w-full flex justify-between md:justify-between items-center mt-6 gap-4'>
                    <button onClick={()=>{setDeletePopup(false)}} className='flex-1 py-1 outline-button'>
                        Cancel
                    </button>
                    <button onClick={deleteBoard} className='flex-1 py-1 bg-red-600 rounded-md text-white font-semibold cursor-pointer outline-none'>
                        Delete
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
    const api = useApi();


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
            const response = await api.patch(`/board/${boardId}/re-name`,
                {newName}
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
                absolute top-full -right-6 shadow-[0px_0px_12px_rgba(12,12,13,0.2)] z-10'>
            <div className='w-full h-full  '>
                <div className='w-full text-start'>
                    <h1 className='text-lg font-semibold text-gray-700'>Rename Board</h1>
                    <p className='text-sm text-gray-400'>Only the board title will be updated. Board data will remain unchanged.</p>
                </div>
                <div className='w-full text-start mt-4'>
                    <label className='text-sm font-semibold text-gray-700' >New title</label>
                    <input type="text"  onChange={handleInput} value={newName}
                        placeholder='Enter list name'
                        className='w-full px-2 py-1 mt-1 text-gray-700 border-[1px] border-gray-300 outline-none rounded-md' />
                </div>
                {   (errorMsg.trim()!=="") &&
                    <div className='text-red-600 text-sm mt-2'>
                    {errorMsg}
                    </div>
                }
                <div className='w-full flex justify-between md:justify-between items-center mt-6 gap-4'>
                    <button onClick={()=>{setShowRenamePopup(false)}} className='flex-1 py-1 outline-button'>
                        Cancel
                    </button>
                    <button onClick={renameBoard} className='primary-button flex-1 py-1'>
                        Rename
                    </button>
                </div>
            </div>
        </div>
    )
}