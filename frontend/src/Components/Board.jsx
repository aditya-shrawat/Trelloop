import React, { useEffect, useRef, useState } from 'react'
import { TbStar } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import List from './List';
import { TbStarFilled } from "react-icons/tb";

const Board = ({setWorkspace}) => {
    const { id, name } = useParams();
    const [board,setBoard] = useState()
    const [loadingLists,setLoadingLists] = useState(true) ;
    const [lists,setLists] = useState([]);
    const [starStatus,setStarStatus] = useState(false)

    const fetchBoard = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/board/${name}/${id}`,
                {withCredentials: true}
            );

            setBoard(response.data.board)
            setWorkspace(response.data.workspace)
        } catch (error) {
            console.log("Error while fetching board - ",error)
        }
    }

    useEffect(()=>{
        fetchBoard()
        fetchLists()
    },[])

    const fetchLists = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/list/board/${id}`,
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

  return (
    <div className='w-full h-full flex flex-col '>
        <div className="w-full h-14 px-4 p-1 border-b-[1px] border-gray-300 ">
            <div className="w-full px-2 py-2 flex justify-between items-center ">
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
                { (loadingLists)?
                <div>Loading lists ...</div>
                :
                <div className='w-auto flex'>
                    {
                    lists.map((list)=>(
                        <List key={list._id} list={list} />
                    ))
                    }
                </div>
                }
                { board &&
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
    <div ref={divRef} className={`min-w-60 h-fit hover:border-[3px] border-[2px] ${creatingNewList &&`border-[3px]`} border-[#49C5C5] rounded-xl p-3 
        cursor-pointer shadow-[0px_4px_8px_rgba(12,12,13,0.2)]`}>
        <div className='w-full h-auto '>
            { (!creatingNewList)?
            <div onClick={()=>setCreatingNewList(true)} className='w-full flex items-center font-semibold text-gray-700'>
                <IoMdAdd className='mr-3 text-xl' /> Add new list
            </div>
            :
            <div className='w-full h-auto'>
                <input type="text" placeholder='List name' onChange={handleInput} value={listName}
                    className='w-full px-2 py-1 rounded-lg text-gray-700 border-[1px] border-gray-300 outline-none ' 
                />
                {
                (errMsg.trim()!=="") &&
                <div className='text-red-500 text-[14px] mt-1'>{errMsg}</div>
                }
                <div className='w-full flex justify-evenly mt-3'>
                    <div onClick={createList} className='font-semibold text-white text-[14px] bg-[#49C5C5] px-2 py-1 cursor-pointer rounded-lg '>
                        Add List
                    </div>
                    <div onClick={()=>{setCreatingNewList(false)}} 
                        className='border-[1px] border-gray-300 px-2 py-1 cursor-pointer text-[14px]
                         text-gray-700 font-semibold rounded-lg '>
                        Cancel
                    </div>
                </div>
            </div>
            }
        </div>
    </div>
    )
}


