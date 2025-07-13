import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

const ListOptions = ({list,setLists,boardId,UserRole,setShowListOptions})=>{
    const divref = useRef();
    const [isEditingList,setIsEditingList] = useState(false)
    const [isDeletingList,setIsDeletingList] = useState(false)
    const [newListName,setNewListName] = useState("")
    const [errorMsg,setErrorMsg] = useState("")

    useEffect(()=>{
        setNewListName(list.name);
    },[])

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            setShowListOptions(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInput = (e)=>{
        e.preventDefault();

        setNewListName(e.target.value)
    }

    const updateList = async (e)=>{
        e.preventDefault();

        if(newListName.trim()===''){
            setErrorMsg("Enter new list name.")
            return ;
        }

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.patch(`${BackendURL}/board/${boardId}/list/${list._id}/update`,
                {newListName:newListName},
            {withCredentials: true}
            );

            setLists(prevLists =>
                prevLists.map(l => 
                    l._id === list._id ? response.data.list : l
                )
            );
            setShowListOptions(false)
        } catch (error) {
            console.log("Error while updating list - ",error)
        }
    }


    const deleteList = async (e)=>{
        e.preventDefault();

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.delete(`${BackendURL}/board/${boardId}/list/${list._id}/delete`,
            {withCredentials: true}
            );

            setLists(prevLists =>
                prevLists.filter(l => l._id !== list._id)
            );
            setShowListOptions(false)
        } catch (error) {
           console.log("Error while deleting list - ",error) 
        }
    }


    return (
    <div ref={divref} className='w-[270px] px-3 py-3 h-auto border-[1px] rounded-lg z-10 bg-white shadow-[0px_0px_12px_rgba(12,12,13,0.3)]
         border-gray-300 absolute top-full left-0 '>
        {
          (isEditingList && !isDeletingList)?
                <div className='w-full px-2'>
                    <h1 className='font-semibold text-gray-700'>Edit list</h1>
                    <p className='text-gray-500 text-sm'>Only the list title will be updated. All cards will remain unchanged.</p>
                    <div className='w-full text-start mt-4'>
                        <label className='text-sm font-semibold text-gray-700' >New title</label>
                        <input type="text"  onChange={handleInput} value={newListName}
                            placeholder='Enter list name'
                            className='w-full px-2 py-1 mt-1 text-gray-700 border-[1px] border-gray-300 outline-none rounded-lg ' />
                    </div>
                    {   (errorMsg.trim()!=="") &&
                        <div className='text-red-600 text-sm mt-2'>
                        {errorMsg}
                        </div>
                    }
                    <div className='w-full flex justify-between items-center mt-4'>
                        <button onClick={updateList} className='w-[45%] py-1 bg-[#49C5C5] outline-none rounded-lg text-white font-semibold cursor-pointer '>
                            Update
                        </button>
                        <button onClick={()=>{setIsEditingList(false)}} className='w-[45%] py-1 outline-none rounded-lg hover:bg-gray-100 text-gray-700 border-[1px] border-gray-300 cursor-pointer '>
                            Cancel
                        </button>
                    </div>
                </div> :

            (isDeletingList && !isEditingList)?
                <div className='w-full px-2'>
                    <h1 className='text-gray-700 font-semibold'>Delete list</h1>
                    <p className='text-gray-500 text-sm'>Once deleted, you won’t be able to recover the list or its cards.</p>
                    <div className='w-full flex items-center justify-between mt-6'>
                        <button onClick={deleteList} className='w-[45%] py-1 text-center outline-none bg-red-500 rounded-lg text-white font-semibold cursor-pointer '>
                            Delete
                        </button>
                        <button onClick={()=>{setIsDeletingList(false)}} className='w-[45%] py-1 outline-none rounded-lg hover:bg-gray-100 text-gray-700 border-[1px] border-gray-300 cursor-pointer '>
                            Cancel
                        </button>
                    </div>
                </div>
            :
            <div className='w-full'>
                <div onClick={()=>{setIsEditingList(true)}} className='text-gray-700 hover:bg-gray-100 font-semibold rounded-lg px-2 py-1 cursor-pointer flex items-center'>
                    <div className='mr-2 '><FiEdit/></div> Change Title
                </div>
                { (UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin) &&
                    <div onClick={()=>{setIsDeletingList(true)}} className='text-gray-700 hover:bg-gray-100 hover:text-red-600 font-semibold rounded-lg px-2 py-1 mt-1 cursor-pointer flex items-center'>
                        <div className='mr-2'><RiDeleteBin6Line/></div> Delete list
                    </div>
                }
            </div>
        }
    </div>
    )
}

export default ListOptions