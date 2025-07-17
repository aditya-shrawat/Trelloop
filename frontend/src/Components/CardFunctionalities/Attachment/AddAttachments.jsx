import axios from "axios";
import React, { useEffect, useRef, useState } from "react";



const AddAttachments = ({setCardFunctionality,setAttachments,cardId})=>{
    const divref = useRef();
    const [inputLink,setInputLink] = useState("")
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

    const handleInput = (e)=>{
        e.preventDefault();

        setInputLink(e.target.value)
    }

    const attachLink = async (e)=>{
        e.preventDefault();

        if(inputLink.trim()===''){
            setErrorMsg("Enter attachment link.")
            return ;
        }

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.patch(`${BackendURL}/card/${cardId}/attachments`,
                {link:inputLink},
            {withCredentials: true}
            );

            setAttachments(response.data.cardAttachments);
            setCardFunctionality(null)
        } catch (error) {
            console.log("Error while attachment - ",error)
        }
    }


    return (
    <div ref={divref} className='bg-white h-fit w-72 sm:w-80 px-4 py-4 rounded-lg border-[1px] border-gray-300 
            absolute bottom-[130%] sm:top-[130%] right-0 shadow-[0px_0px_12px_rgba(12,12,13,0.3)] z-10 '>
        <div className='w-full h-full  '>
            <div className='w-full text-start'>
                <h1 className='text-lg font-semibold text-gray-700'>Add Attachment</h1>
                <p className='text-sm mt-1 text-gray-600'>Add a link to any file, image, or document you want to attach to this card.</p>
            </div>
            <div className='w-full text-start mt-4'>
                <label className='text-base font-semibold text-gray-700' >Paste link</label>
                <input type="text"  onChange={handleInput} value={inputLink}
                    className='w-full px-2 py-1 mt-1 text-gray-700 border-[0.5px] border-gray-300 outline-none rounded-lg ' />
            </div>
            {   (errorMsg.trim()!=="") &&
                <div className='text-red-600 text-sm mt-2'>
                {errorMsg}
                </div>
            }
            <div className='w-full flex gap-4 mt-6'>
                <button onClick={()=>{setCardFunctionality(null)}} className='flex-1 py-1 rounded-lg text-gray-700 hover:bg-gray-100 border-[1px] border-gray-300 cursor-pointer outline-none'>
                    Cancel
                </button>
                <button onClick={attachLink} className='flex-1 py-1 bg-[#49C5C5] rounded-lg text-white font-semibold cursor-pointer outline-none border-none '>
                    Add
                </button>
            </div>
        </div>
    </div>
    )
}


export default AddAttachments ;
