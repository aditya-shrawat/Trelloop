import React, { useEffect, useRef, useState } from 'react'
import { TbStar } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import axios from 'axios';
import List from '../Components/List';
import { TbStarFilled } from "react-icons/tb";
import Header from '../Components/Header';
import { FaBarsStaggered } from "react-icons/fa6";
import BoardOptionMenu from '../Components/Board Components/BoardOptionMenu';
import { useParams } from 'react-router-dom';
import { useUser } from '../Contexts/UserContext';
import AddMemberToBoard from '../Components/Board Components/AddMemberToBoard';
import socket from '../Socket/socket';
import useBoardSocket from '../Socket/useBoardSocket';

const Board = () => {
    const { id, name } = useParams();
    const [board,setBoard] = useState()
    const [loadingLists,setLoadingLists] = useState(true) ;
    const [lists,setLists] = useState([]);
    const [starStatus,setStarStatus] = useState(false)
    const [showBoardOptions,setShowBoardOptions] = useState(false)
    const [UserRole,setUserRole] = useState({
                            isBoardMember: undefined,
                            isWorkspaceMember: undefined,
                            isBoardAdmin: undefined,
                            isWorkspaceAdmin: undefined,
                            joinRequestSent:undefined
                        });
    const [isJoining,setIsJoining] = useState(false);
    const [isAddingNewMembers,setIsAddingNewMembers] = useState(false);
    const [boardBg,setBoardBg] = useState('#fff');

    const {user} = useUser();

    const fetchBoard = async ()=>{
            try {
                const BackendURL = import.meta.env.VITE_BackendURL;
                const response = await axios.get(`${BackendURL}/board/${name}/${id}`,
                    {withCredentials: true}
                );

                setBoard(response.data.board)
                setBoardBg(response.data.board.background)
            } catch (error) {
                console.log("Error while fetching board - ",error)
            }
    }

    const fetchLists = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/board/${id}/lists`,
                {withCredentials: true}
            );

            setLists(response.data.lists)
        } catch (error) {
            console.log("Error while fetching lists - ",error)
        }
        finally{
            setLoadingLists(false)
        }
    }

    const fetchStarStatus = async (e)=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/board/${id}/starred`,
                {withCredentials: true}
            );

            setStarStatus(response.data.starStatus)
        } catch (error) {
            console.log("Error while fetching star status - ",error)
        }
    }

    useEffect(()=>{
        if(id && name){
            fetchBoard()
            fetchLists()
            fetchStarStatus()
        }
    },[id,name])

    const toggleStarStatus = async (e)=>{
        e.preventDefault();

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.post(`${BackendURL}/board/${id}/starred`,
                {},
                {withCredentials: true}
            );

            setStarStatus(response.data.starStatus)
        } catch (error) {
            console.log("Error while toggling star status - ",error)
        }
    }

    useEffect(() => {
        if (board && user) {
            const workspace = board.workspace;
            const userId = user.id?.toString();

            const isBoardMember = board.members?.some(id => id.toString() === userId);
            const isWorkspaceMember = workspace.members?.some(id => id.toString() === userId);
            const isBoardAdmin = board.admin._id?.toString() === userId;
            const isWorkspaceAdmin = workspace.createdBy?.toString() === userId;
            const joinRequestSent = board.pendingRequests?.some(id =>id.toString()===userId);

            setUserRole({
                    isBoardMember,
                    isWorkspaceMember,
                    isBoardAdmin,
                    isWorkspaceAdmin,
                    joinRequestSent
                });
        }
    }, [board,user]);

    const joinMember = async()=>{
        if(UserRole.isBoardMember || UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin){
            return;
        }
        setIsJoining(true);

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.post(`${BackendURL}/board/${id}/join`,
                {},
                {withCredentials: true}
            );

            console.log(response.data.message)
        } catch (error) {
            console.log("Error in joing board memb - ",error)
        }
        finally{
            setIsJoining(false);
        }
    }

    let shouldJoinBoardRoom = UserRole.isBoardAdmin || UserRole.isBoardMember || UserRole.isWorkspaceAdmin || UserRole.isWorkspaceMember ;
    useBoardSocket(socket, (shouldJoinBoardRoom)?id:null ,{}); // join board room

    const sendRequestToJoinBoard = async ()=>{
        if(!board._id || !user.id){
            return
        }

        setUserRole((prev) => ({ ...prev, joinRequestSent: true }));
        try {
            socket.emit('send_board_request',{
                boardId:board._id,
                senderId:user.id
            })

            socket.once('board_request_sent',(data)=>{
                console.log("request sent - ",data)
            })
        } catch (error) {
            console.log("error while sending request", error);
        }
    }

  return (
    <div className='w-full h-screen flex flex-col ' style={{background:boardBg}}>
        <Header onBoard={true} />

    <div className='w-full pb-2 flex flex-1 min-h-0 flex-col pt-14'>
        <div className="z-10 w-full h-14 px-4 py-1 sticky left-0 backdrop-blur-md bg-white/10 shadow-sm" >
            <div className="w-full sm:px-2 py-2 flex justify-between items-center ">
                <div className='w-auto flex items-center text-white'>
                    {
                    (board) && <h3 className='inline-block font-bold text-xl'>{board.name}</h3>
                    }
                    <div onClick={toggleStarStatus} 
                          className="inline-block ml-3 cursor-pointer text-xl ">
                        {
                        (!starStatus)?
                        <div className='hover:scale-115 hover:text-[#ffc300]'>
                          <TbStar />
                        </div>
                        :
                        <div className='hover:scale-115 text-[#ffc300]'>
                          <TbStarFilled />
                        </div>
                        }
                    </div>
                </div>
                <div className='w-auto flex' >
                    { (board) &&
                    <div className='flex items-center mr-3'>
                        <div className='w-auto h-auto hidden sm:block'> 
                            <div title='Admin' className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center cursor-pointer">
                                <span className="font-semibold text-white text-lg ">
                                    {board.admin.name && board.admin.name[0].toUpperCase()} 
                                </span>
                            </div>
                        </div>
                        {(board) &&
                            (
                                (UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin)?
                                    (
                                    <div className='relative '>
                                        <div onClick={()=>{setIsAddingNewMembers(true)}} className='w-auto h-auto'>
                                            <div className='px-4 py-1 ml-3 border-[1px] border-white hover:text-gray-700 shadow-sm hover:shadow-lg rounded-md cursor-pointer text-white font-semibold'>
                                                Add
                                            </div>
                                        </div>
                                        {isAddingNewMembers && <AddMemberToBoard setIsAddingNewMembers={setIsAddingNewMembers} board={board} />}
                                    </div>
                                    )
                                :
                                (!UserRole.isBoardMember && UserRole.isWorkspaceMember && (board.visibility==='Workspace' || board.visibility==='Public')) ?
                                    (<div onClick={joinMember} className='w-auto h-auto'>
                                        <div className='px-4 py-1 ml-3 border-[1px] border-white hover:text-gray-700 shadow-sm hover:shadow-lg rounded-md cursor-pointer text-white font-semibold'>
                                            {(isJoining)?"...":"Join"}
                                        </div>
                                    </div>)
                                :
                                (board.visibility==='Public' && (!UserRole.isBoardMember && !UserRole.isWorkspaceMember && !UserRole.isBoardAdmin && !UserRole.isWorkspaceAdmin && !UserRole.joinRequestSent) ) ? 
                                    (<div className='w-auto h-auto'>
                                        <div onClick={sendRequestToJoinBoard} className='px-4 py-1 ml-3 border-[1px] border-white hover:text-gray-700 shadow-sm hover:shadow-lg rounded-md cursor-pointer text-white font-semibold'>
                                            Send Request
                                        </div>
                                    </div>)
                                :
                                (board.visibility==='Public' && UserRole.joinRequestSent)?
                                    (<div className='w-auto h-auto'>
                                        <div className='px-4 py-1 ml-3 border-[1px] border-white hover:text-gray-700 shadow-sm hover:shadow-lg rounded-md cursor-pointer text-white font-semibold'>
                                            Pending...
                                        </div>
                                    </div>)
                                :null
                            )
                        }
                    </div>
                    }
                    <div className='w-auto relative'>
                        <div onClick={()=>{setShowBoardOptions(true)}} className={`w-auto h-auto p-1.5 text-xl cursor-pointer ${(showBoardOptions) ? `text-gray-700 bg-white`:`text-white hover:text-gray-700`} rounded-md`} >
                            <FaBarsStaggered  />
                        </div>
                        {
                            (showBoardOptions && board) && <BoardOptionMenu board={board} setBoard={setBoard} starStatus={starStatus} setBoardBg={setBoardBg} toggleStarStatus={toggleStarStatus} 
                            setShowBoardOptions={setShowBoardOptions} UserRole={UserRole} />
                        }
                    </div>
                </div>
            </div>
        </div>
        <div className='p-4 pb-8 flex flex-1 min-h-0 overflow-y-hidden overflow-x-auto custom-scrollbar'>
                { (loadingLists)?
                <div>Loading lists ...</div>
                :
                <>
                    { (board && board._id)&&
                    lists.map((list)=>(
                        <List key={list._id} list={list} boardId={board._id} setLists={setLists} UserRole={UserRole} />
                    ))
                    }
                </>
                }
                { (board && (UserRole.isBoardMember || UserRole.isWorkspaceMember || UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin) ) &&
                    <AddNewList boardId={board._id} setLists={setLists} />
                }
        </div>
    </div>

    </div>
  )
}

export default Board



const AddNewList = ({boardId,setLists})=>{
    const [listName,setListName] = useState("");
    const [creatingNewList,setCreatingNewList] = useState(false)
    const divRef = useRef(null);
    const [errMsg,setErrMsg] = useState("");

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (divRef.current && !divRef.current.contains(e.target)) {
            setCreatingNewList(false);
            setListName("")
            setErrMsg("")
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleInput = (e)=>{
        e.preventDefault();
        setListName(e.target.value)
    }

    const createList = async (e)=>{
        e.preventDefault();

        if(listName.trim()===""){
            setErrMsg("List name is required.");
            return 
        }

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.post(`${BackendURL}/board/${boardId}/newList`,
                {listName},
                {withCredentials: true}
            ); 

            setLists(prevLists => [...prevLists, response.data.list])
        } catch (error) {
            console.log("Error while creating list - ",error)
        }
        finally{
            setCreatingNewList(false);
            setListName("")
            setErrMsg("")
        }
    }


    return (
    <div ref={divRef} className={`min-w-60 h-fit backdrop-blur-md bg-white/20 rounded-xl border-3 border-white/20
        cursor-pointer shadow-[0px_4px_8px_rgba(12,12,13,0.2)]`}>
        <div className='w-full h-auto '>
            { (!creatingNewList)?
            <div onClick={()=>setCreatingNewList(true)} className='w-full p-3 flex items-center font-semibold text-white'>
                <IoMdAdd className='mr-3 text-xl' /> Add new list
            </div>
            :
            <div className='w-full h-auto p-3'>
                <input type="text" placeholder='List title' onChange={handleInput} value={listName}
                    className='w-full px-2 py-1 rounded-md text-white border-[1px] border-white outline-none ' 
                />
                {
                (errMsg.trim()!=="") &&
                <div className='text-red-500 text-sm mt-1'>{errMsg}</div>
                }
                <div className='w-full justify-between mt-3 flex gap-4'>
                    <button onClick={()=>{setCreatingNewList(false)}} 
                        className='outline-button border-[1px] hover:backdrop-blur-md hover:bg-white/10 border-white flex-1 py-1 text-sm text-white'>
                        Cancel
                    </button>
                    <button onClick={createList} className='primary-button flex-1 text-sm py-1'>
                        Add List
                    </button>
                </div>
            </div>
            }
        </div>
    </div>
    )
}


