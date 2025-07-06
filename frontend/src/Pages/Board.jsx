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
                            isWorkspaceAdmin: undefined
                        });

    const {user} = useUser();

    const fetchBoard = async ()=>{
            try {
                const BackendURL = import.meta.env.VITE_BackendURL;
                const response = await axios.get(`${BackendURL}/board/${name}/${id}`,
                    {withCredentials: true}
                );

                setBoard(response.data.board)
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

    useEffect(()=>{
        fetchBoard()
        fetchLists()
    },[id,name])


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
        fetchStarStatus()
    },[])

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
            const isBoardAdmin = board.admin?.toString() === userId;
            const isWorkspaceAdmin = workspace.createdBy?.toString() === userId;

            setUserRole({
                    isBoardMember,
                    isWorkspaceMember,
                    isBoardAdmin,
                    isWorkspaceAdmin
                });
        }
    }, [board,user]);

  return (
    <div className='w-full h-screen flex flex-col '>
        <Header  />

    <div className='w-full pb-2 flex flex-1 min-h-0 flex-col'>
        <div className="z-10 w-full h-14 px-4 py-1 border-b-[1px] border-gray-300 sticky left-0 bg-white ">
            <div className="w-full sm:px-2 py-2 flex justify-between items-center ">
                <div className='w-auto flex items-center'>
                    {
                    (board) && <h3 className='inline-block font-bold text-gray-700 text-xl'>{board.name}</h3>
                    }
                    <div onClick={toggleStarStatus} 
                          className="inline-block ml-3 cursor-pointer text-xl ">
                        {
                        (!starStatus)?
                        <div className='text-gray-700 hover:scale-115 hover:text-[#ffc300]'>
                          <TbStar />
                        </div>
                        :
                        <div className='hover:scale-115 text-[#ffc300]'>
                          <TbStarFilled />
                        </div>
                        }
                    </div>
                </div>
                <div className='w-auto' >
                    <div onClick={()=>{setShowBoardOptions(true)}} className='w-auto h-auto p-2 text-xl cursor-pointer hover:bg-gray-100 rounded-lg'>
                        <FaBarsStaggered  />
                    </div>
                    {
                        (showBoardOptions && board) && <BoardOptionMenu board={board} setBoard={setBoard} starStatus={starStatus} toggleStarStatus={toggleStarStatus} 
                        setShowBoardOptions={setShowBoardOptions} UserRole={UserRole} />
                    }
                </div>
            </div>
        </div>
        <div className='p-4 pb-8 flex flex-1 min-h-0 overflow-y-hidden overflow-x-auto'>
                { (loadingLists)?
                <div>Loading lists ...</div>
                :
                <>
                    { (board && board._id)&&
                    lists.map((list)=>(
                        <List key={list._id} list={list} boardId={board._id} UserRole={UserRole} />
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
    <div ref={divRef} className={`min-w-60 h-fit hover:border-[3px] border-[2px] ${creatingNewList &&`border-[3px]`} border-[#49C5C5] rounded-xl 
        cursor-pointer shadow-[0px_4px_8px_rgba(12,12,13,0.2)]`}>
        <div className='w-full h-auto '>
            { (!creatingNewList)?
            <div onClick={()=>setCreatingNewList(true)} className='w-full p-3 flex items-center font-semibold text-gray-700'>
                <IoMdAdd className='mr-3 text-xl' /> Add new list
            </div>
            :
            <div className='w-full h-auto p-3'>
                <input type="text" placeholder='List name' onChange={handleInput} value={listName}
                    className='w-full px-2 py-1 rounded-lg text-gray-700 border-[1px] border-gray-300 outline-none ' 
                />
                {
                (errMsg.trim()!=="") &&
                <div className='text-red-500 text-[14px] mt-1'>{errMsg}</div>
                }
                <div className='w-full flex justify-between mt-3'>
                    <button onClick={createList} className='w-[45%] font-semibold text-white text-[14px] bg-[#49C5C5] py-1 outline-none cursor-pointer rounded-lg '>
                        Add List
                    </button>
                    <button onClick={()=>{setCreatingNewList(false)}} 
                        className='border-[1px] border-gray-300 w-[45%] py-1 outline-none cursor-pointer text-[14px]
                         text-gray-700 font-semibold rounded-lg hover:bg-gray-100 '>
                        Cancel
                    </button>
                </div>
            </div>
            }
        </div>
    </div>
    )
}


