import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteCard = ({setCardFunctionality,cardId})=>{
    const navigate = useNavigate()
    const divref = useRef();
    const [errorMsg,setErrorMsg] = useState("")


    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            setCardFunctionality(null);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const deletingCard = async (e)=>{
        e.preventDefault();

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.delete(`${BackendURL}/card/${cardId}/delete`,
            {withCredentials: true}
            );

            console.log("card deleted")
            setCardFunctionality(null)
            navigate(-1)
        } catch (error) {
            console.log("Error while deleting card - ",error)
            setErrorMsg("Something went wrong!")
        }
    }


    return (
    <div ref={divref} className='bg-white h-fit w-72 sm:w-80 px-4 py-4 rounded-lg border-[1px] border-gray-300 
            absolute bottom-[130%] sm:top-[130%] sm:right-0 shadow-[0px_0px_12px_rgba(12,12,13,0.3)] '>
        <div className='w-full h-full  '>
            <div className='w-full text-start'>
                <h1 className='text-lg font-semibold text-gray-700'>Delete card</h1>
                <p className='text-sm mt-1 text-gray-600'>Once deleted, you won’t be able to recover the card or its data.</p>
            </div>
            {   (errorMsg.trim()!=="") &&
                <div className='text-red-600 text-sm mt-2'>
                {errorMsg}
                </div>
            }
            <div className='w-full flex gap-4 mt-4'>
                <button onClick={()=>{setCardFunctionality(null)}} className='flex-1 py-1 rounded-lg text-gray-700 hover:bg-gray-100 border-[1px] border-gray-300 cursor-pointer outline-none'>
                    Cancel
                </button>
                <button onClick={deletingCard} className='flex-1 py-1 bg-red-600 rounded-lg text-white font-semibold cursor-pointer outline-none border-none '>
                    Delete
                </button>
            </div>
        </div>
    </div>
    )
}

export default DeleteCard