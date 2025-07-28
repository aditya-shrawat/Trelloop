import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

const EditAttachment = ({setEditAttachment,link,setAttachments,index})=>{
    const divref = useRef();
    const [editingAttachment,setEditingAttachment] = useState(false)
    const [deletingAttachment,setDeletingAttachment] = useState(false)
    const [newInputLink,setNewInputLink] = useState("")
    const [errorMsg,setErrorMsg] = useState("")

    const { id } = useParams();

    useEffect(()=>{
        setNewInputLink(link);
    },[])

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            setEditAttachment(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInput = (e)=>{
        e.preventDefault();

        setNewInputLink(e.target.value)
    }

    const updateAttachment = async (e)=>{
        e.preventDefault();

        if(newInputLink.trim()===''){
            setErrorMsg("Enter a link.")
            return ;
        }

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.patch(`${BackendURL}/card/${id}/update/attachment`,
                {newLink:newInputLink,index:index},
            {withCredentials: true}
            );

            setAttachments(response.data.cardAttachments);
            setEditAttachment(false)
        } catch (error) {
            console.log("Error while editing attachment - ",error)
        }
    }


    const deleteAttachment = async (e)=>{
        e.preventDefault();

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.patch(`${BackendURL}/card/${id}/delete/attachment`,
                {index:index},
            {withCredentials: true}
            );

            setAttachments(response.data.cardAttachments);
            setEditAttachment(false)
        } catch (error) {
           console.log("Error while deleting attachment - ",error) 
        }
    }


    return (
    <div ref={divref} className='w-72 px-3 py-4 h-auto border-[1px] rounded-lg z-10 bg-white shadow-[0px_0px_12px_rgba(12,12,13,0.2)]
         border-gray-300 absolute top-[130%] right-0 '>
        {
          (editingAttachment && !deletingAttachment)?
                <div className='w-full px-1'>
                    <h1 className='font-semibold text-gray-700'>Edit attachment</h1>
                    <p className='text-gray-400 text-sm'>Paste the new link to update the attachment.</p>
                    <div className='w-full text-start mt-4'>
                        <label className='text-base text-gray-700' >Paste link</label>
                        <input type="text"  onChange={handleInput} value={newInputLink}
                            placeholder='Enter new link'
                            className='w-full px-2 py-1 mt-1 text-gray-700 border-[1px] border-gray-300 outline-none rounded-md' />
                    </div>
                    {   (errorMsg.trim()!=="") &&
                        <div className='text-red-600 text-sm mt-2'>
                        {errorMsg}
                        </div>
                    }
                    <div className='w-full flex gap-4 mt-6'>
                        <button onClick={()=>{setEditAttachment(false)}} className='outline-button flex-1 py-1'>
                            Cancel
                        </button>
                        <button onClick={updateAttachment} className='primary-button flex-1 py-1'>
                            Update
                        </button>
                    </div>
                </div> :

            (deletingAttachment && !editingAttachment)?
                <div className='w-full px-1'>
                    <h1 className='text-gray-700 font-semibold'>Delete attachment?</h1>
                    <p className='text-gray-400 text-sm'>Delete this attachment? There is no undo.</p>
                    <div className='w-full flex items-center mt-6'>
                        <div onClick={deleteAttachment} className='w-full py-1 text-center bg-red-500 rounded-md text-white font-semibold cursor-pointer'>
                            Delete
                        </div>
                    </div>
                </div>
            :
            <div className='w-full'>
                <div onClick={()=>{setEditingAttachment(true)}} className='text-gray-700 hover:bg-gray-100 font-semibold rounded-md px-2 py-1 cursor-pointer flex items-center'>
                    <div className='mr-3'><FiEdit/></div> Edit
                </div>
                <div onClick={()=>{setDeletingAttachment(true)}} className='text-gray-700 hover:bg-gray-100 hover:text-red-600 font-semibold rounded-md px-2 py-1 mt-1 cursor-pointer flex items-center'>
                    <div className='mr-3'><RiDeleteBin6Line/></div> Delete
                </div>
            </div>
        }
    </div>
    )
}

export default EditAttachment