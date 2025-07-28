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
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyBoards = () => {
    const [workspaces,setWorkspaces] = useState([]);
    const [loading,setLoading]= useState(true)
    const [starredBoards,setStarredBoards] = useState([]);
    const [sharedBoards,setSharedBoards] = useState([]);

    const fetchAllJoinedWorkspaces = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/board/joined-workspaces-boards`, {
                withCredentials: true,
            });

            setWorkspaces(response.data.workspaces)
        } catch (error) {
            console.log("Error ",error)
        }
        finally{
            setLoading(false)
        }
    }

    const fetchStarredBoards = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/board/starred-boards`,
                {withCredentials: true}
            );

            setStarredBoards(response.data.starredBoards)
        } catch (error) {
            console.log("Error while fetching starred boards ",error)
        }
    }

    const fetchSharedBoards = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/board/shared-boards`,
                {withCredentials: true}
            );

            setSharedBoards(response.data.sharedBoards)
        } catch (error) {
            console.log("Error while fetching joined boards ",error)
        }
    }

    useEffect(()=>{
        fetchAllJoinedWorkspaces()
        fetchStarredBoards();
        fetchSharedBoards();
    },[])

  return (
    <div className='w-full p-4 md:pl-8'>
        {
        (starredBoards && starredBoards.length!==0)&&
            (<div className='w-full h-auto mb-8'>
                <div className='w-full'>
                    <h3 className='text-base font-semibold text-gray-700'>STARRED BOARDS</h3>
                    <h3 className='text-gray-400 text-sm'>Your favorite boards marked for quick access.</h3>
                </div>
                <div className="w-full h-auto mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-4 ">
                    {
                        starredBoards?.map((board) => (
                            <BoardItem key={board._id} board={board} /> 
                        ))
                    }
                </div>
            </div>)
        }

        {
        (sharedBoards && sharedBoards.length!==0)&&
            (<div className='w-full h-auto mb-8'>
                <div className='w-full'>
                    <h3 className='text-base font-semibold text-gray-700'>SHARED BOARDS</h3>
                    <h3 className='text-gray-400 text-sm'>Boards you're a member of, but not part of their workspace.</h3>
                </div>
                <div className="w-full h-auto mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-4 ">
                    {
                        sharedBoards?.map((board) => (
                            <BoardItem key={board._id} board={board} /> 
                        ))
                    }
                </div>
            </div>)
        }

        <div className='w-full h-auto'>
            <div className='w-full mb-4'>
                <h3 className='text-base font-semibold text-gray-700'>YOUR BOARDS</h3>
                <h3 className='text-gray-400 text-sm'>All boards from workspaces you have created or joined.</h3>
            </div>
            <div className='w-full h-auto space-y-8 '>
            {
            (loading)?
            <div>loading ....</div>
            :
            (workspaces.length!==0)
            ?
            (workspaces.map((workspace) => ( 
                <div key={workspace._id} className='w-full h-auto '>
                    <div className='w-full flex items-center justify-between '>
                        <div className="w-full text-gray-700 flex items-center ">
                            <div className="w-auto h-auto inline-block mr-3">
                                <span className="w-8 h-8 font-bold text-white bg-blue-300 rounded-md flex items-center justify-center ">
                                    {workspace.name[0].toUpperCase()}
                                </span>
                            </div>
                            <div className="w-full font-semibold">
                                <div className=" line-clamp-2 break-words">{workspace.name}</div>
                            </div>
                        </div>
                        <WorkspaceNavigators workspace={workspace} />
                    </div>

                    <div className="w-full h-auto mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-4 ">
                        {
                        (workspace.boards && workspace.boards.length > 0)?
                        (workspace.boards).map((board) => (
                            <BoardItem key={board._id} board={board} /> 
                        ))
                        :
                        <div className="min-w-44 max-w-56 h-28 p-3 rounded-lg bg-gray-50 text-gray-500 hover:text-gray-700 flex justify-center items-center border-[1px] border-gray-300 ">
                            <h3 className="font-semibold ">No board</h3>
                        </div>
                        }
                    </div>
                </div>
            ))
            )
            :
            (
                <div className="text-center text-gray-400 py-10">
                    <p className="text-lg font-medium">No workspaces found!</p>
                    <p className="text-sm">You're not a member and haven't created any workspace yet.</p>
                </div>)
            }
            </div>
        </div>
    </div>
  )
}

export default MyBoards


const WorkspaceNavigators = ({workspace})=>{
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
                <Link to={`/workspace/${workspace.name.replace(/\s+/g, '')}/${workspace._id}/home`} 
                    className='w-auto h-full px-2 py-1 ml-2 text-sm text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 
                        rounded-sm cursor-pointer flex items-center'>
                    <div className='mr-2'><TbLayoutDashboardFilled /></div>
                    Bords
                </Link>
                <Link to={`/workspace/${workspace.name.replace(/\s+/g, '')}/${workspace._id}/members`}
                    className='w-auto h-full px-2 py-1 ml-2 text-sm text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 
                        rounded-sm cursor-pointer flex items-center'>
                    <div className='mr-2'><IoPerson /></div>
                    Members
                </Link>
                <Link to={`/workspace/${workspace.name.replace(/\s+/g, '')}/${workspace._id}/settings`} 
                    className='w-auto h-full px-2 py-1 ml-2 text-sm text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 
                        rounded-sm cursor-pointer flex items-center'>
                    <div className='mr-2'><IoMdSettings /></div>
                    Settings
                </Link>
            </div>

            <div className='w-auto h-full block lg:hidden relative'>
                <div onClick={showNavigators} className='w-fit h-full p-[0.5px] ml-2 text-lg cursor-pointer'>
                    <BsThreeDotsVertical />
                </div>

                { (show) &&
                <div ref={divRef} className='w-56 h-auto bg-white shadow-[0px_0px_8px_rgba(12,12,13,0.3)] border-[1px] border-gray-300 
                    rounded-md space-y-1 py-4 px-2 flex flex-col absolute top-[130%] right-0 z-20 '>
                    <Link to={`/workspace/${workspace.name.replace(/\s+/g, '')}/${workspace._id}/home`} 
                        className='w-auto h-full px-2 py-1 text-gray-500 hover:text-gray-700 font-semibold rounded-sm cursor-pointer flex items-center'>
                        <div className='mr-3'><TbLayoutDashboardFilled /></div>
                        Bords
                    </Link>
                    <Link to={`/workspace/${workspace.name.replace(/\s+/g, '')}/${workspace._id}/members`}
                        className='w-auto h-full px-2 py-1 text-gray-500 hover:text-gray-700 font-semibold rounded-sm cursor-pointer flex items-center'>
                        <div className='mr-3'><IoPerson /></div>
                        Members
                    </Link>
                    <Link to={`/workspace/${workspace.name.replace(/\s+/g, '')}/${workspace._id}/settings`} 
                        className='w-auto h-full px-2 py-1 text-gray-500 hover:text-gray-700 font-semibold rounded-sm cursor-pointer flex items-center'>
                        <div className='mr-3'><IoMdSettings /></div>
                        Settings
                    </Link>
                </div>
                }
            </div>

        </div>
    )
}


const BoardItem = ({board})=>{
    return (
        <Link to={`/board/${board.name.replace(/\s+/g, '')}/${board._id}`} style={{background:board.background || '#000'}}
            className="min-w-24 w-full lg:max-w-56 h-28 p-3 rounded-lg hover:shadow-[0px_4px_8px_rgba(12,12,13,0.3)] cursor-pointer relative">
            <h3 className="font-bold text-white line-clamp-2">{board.name}</h3>
            {/* <div className="inline-block text-xl absolute bottom-3 right-3 ">
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
            </div> */}
        </Link>
    )
}