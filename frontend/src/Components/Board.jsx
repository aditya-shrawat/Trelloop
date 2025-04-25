import React, { useEffect, useRef, useState } from 'react'
import { TbStar } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Board = ({setWorkspace}) => {
    const { id, name } = useParams();
    const [board,setBoard] = useState()
    const [loadingLists,setLoadingLists] = useState(true) ;
    const [lists,setLists] = useState([]);

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


  return (
    <div className='w-full h-full flex flex-col '>
        <div className="w-full h-14 px-4 p-1 border-b-[1px] border-gray-300 ">
            <div className="w-full px-2 py-2 flex justify-between items-center ">
                <div className='w-auto flex items-center'>
                    {
                    (board) && <h3 className='inline-block font-bold text-gray-600 text-xl'>{board.name}</h3>
                    }
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
                { (loadingLists)?
                <div>Loading lists ...</div>
                :
                <div className='w-auto flex'>
                    {
                    lists.map((list)=>(
                        <div key={list._id} className='w-60 p-2 mr-4 border-[1px] border-gray-300 rounded-xl '>
                            <div className='w-full p-1 mb-2 break-words font-semibold'>
                                {list.name}
                            </div>
                            <div className='w-full px-1 py-2 hover:bg-gray-200 cursor-pointer rounded-xl flex items-center font-semibold text-gray-600'>
                                <IoMdAdd className='mr-3 text-xl' /> Add card
                            </div>
                        </div>
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
        }
    }


    return (
    <div ref={divRef} className={`min-w-60 h-fit hover:border-[3px] border-[2px] ${creatingNewList &&`border-[3px]`} border-[#49C5C5] rounded-xl p-3 
        cursor-pointer shadow-[0px_4px_8px_rgba(12,12,13,0.2)]`}>
        <div className='w-full h-auto '>
            { (!creatingNewList)?
            <div onClick={()=>setCreatingNewList(true)} className='w-full flex items-center font-semibold text-gray-600'>
                <IoMdAdd className='mr-3 text-xl' /> Add new list
            </div>
            :
            <div className='w-full h-auto'>
                <input type="text" placeholder='List name' onChange={handleInput} value={listName}
                    className='w-full px-2 py-1 rounded-lg border-[1px] border-gray-300 outline-none ' 
                />
                {
                (errMsg.trim()!=="") &&
                <div className='text-red-500 text-[14px] mt-1'>{errMsg}</div>
                }
                <div className='w-full flex justify-evenly mt-3'>
                    <div onClick={createList} className='font-semibold text-white bg-[#49C5C5] px-2 py-1 cursor-pointer rounded-lg '>
                        Add List
                    </div>
                    <div onClick={()=>{setCreatingNewList(false)}} className='border-[1px] border-gray-300 px-2 py-1 cursor-pointer rounded-lg '>
                        Cancel
                    </div>
                </div>
            </div>
            }
        </div>
    </div>
    )
}


