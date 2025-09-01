import React, { useEffect, useRef, useState } from 'react'
import { useApi } from '../../../../api/useApi';

const DatePicker = ({onClose,cardId,setCard}) => {
    const divref = useRef();
    const [errorMsg,setErrorMsg] = useState("")
    const [newDeadline,setNewDeadline] = useState(null);
    const api = useApi();


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
            const response = await api.patch(`/card/${cardId}/deadline`,
                {newDeadline}
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
            absolute bottom-[130%] left-0 shadow-[0px_0px_12px_rgba(12,12,13,0.2)] z-10 '> 
        <div className='w-full h-auto '>
            <div className='w-full h-auto' >
                <h3 className=' text-gray-700 font-semibold'>Set Deadline</h3>
                <h3 className='text-gray-400 text-sm'>Reminders will be sent to all members of this card one day before the deadline.</h3>
            </div>
            <div className='mt-3'>
                <input onChange={(e)=>{setNewDeadline(e.target.value)}} type="date" className='outline-none border-[1px] border-gray-300 cursor-pointer w-full px-2 py-2 rounded-md text-gray-700' />
            </div>
            {   (errorMsg.trim()!=="") &&
                <div className='text-red-600 text-sm mt-2'>
                {errorMsg}
                </div>
            }
            <div className='flex gap-4 mt-6'>
                <button onClick={onClose} className='outline-button flex-1 py-1'>
                    Cancel
                </button>
                <button onClick={saveDeadline} className='primary-button flex-1 py-1'>
                    Save
                </button>
            </div>
        </div>
    </div>
  )
}

export default DatePicker