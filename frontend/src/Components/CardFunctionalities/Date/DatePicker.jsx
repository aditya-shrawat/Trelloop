import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'

const DatePicker = ({onClose,cardId,setCard}) => {
    const divref = useRef();
    const [errorMsg,setErrorMsg] = useState("")
    const [newDeadline,setNewDeadline] = useState(null);


    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            onClose();
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const saveDeadline = async ()=>{
        if(!newDeadline) {
            setErrorMsg("Select deadline!")
            return;
        }
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.patch(`${BackendURL}/card/${cardId}/deadline`,
                {newDeadline},
            {withCredentials: true}
            );

            setCard((prev)=>({...prev,deadline:newDeadline}));
            onClose()
        } catch (error) {
            console.log("Error while changing deadline - ",error)
            setErrorMsg("Something went wrong. Try later!");
        }
    }


  return (
    <div ref={divref} className='bg-white h-fit w-72 sm:w-80 px-4 py-4 rounded-lg border-[1px] border-gray-300 
            absolute bottom-[130%] sm:top-[130%] right-0 shadow-[0px_0px_12px_rgba(12,12,13,0.3)] z-10 '> 
        <div className='w-full h-auto '>
            <div className='w-full h-auto' >
                <h3 className=' text-gray-700 font-semibold'>Set deadline</h3>
                <h3 className='text-gray-500 text-sm'>Reminders will be sent to all members of this card one day before the deadline.</h3>
            </div>
            <div className='mt-3'>
                <input onChange={(e)=>{setNewDeadline(e.target.value)}} type="date" className='outline-[#49C5C5] border-[1px] border-gray-300 cursor-pointer w-full px-2 py-2 rounded-lg text-gray-700 ' />
            </div>
            {   (errorMsg.trim()!=="") &&
                <div className='text-red-600 text-sm mt-2'>
                {errorMsg}
                </div>
            }
            <div className='flex gap-4 mt-6'>
                <button onClick={onClose} className='flex flex-1 justify-center items-center py-1 text-gray-700 border-[1px] border-gray-300 rounded-lg font-semibold cursor-pointer '>
                    Cancel
                </button>
                <button onClick={saveDeadline} className='flex flex-1 justify-center items-center py-1 text-white bg-[#49C5C5] rounded-lg font-semibold cursor-pointer'>
                    Save
                </button>
            </div>
        </div>
    </div>
  )
}

export default DatePicker