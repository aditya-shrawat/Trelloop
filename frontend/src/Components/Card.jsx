import React, { useEffect, useState } from 'react'
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { GoCheckCircleFill } from "react-icons/go";
import { FaRegClock } from "react-icons/fa6";
import axios from 'axios';
import { Link } from 'react-router-dom';

const Card = ({card,UserRole})=>{
    const [isCompleted,setIsCompleted] = useState(null)

    useEffect(()=>{
        setIsCompleted(card.isCompleted)
    },[])

    const toggleCardStatus = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.patch(`${BackendURL}/card/${card._id}/isCompleted`,
                {},
            {withCredentials: true}
            );

            setIsCompleted(response.data.isCompleted)
        } catch (error) {
            console.log("Error while toggling card status - ",error)
        }
    }
    
    return (
    <Link to={`/card/${(card.name).replace(/\s+/g, '')}/${card._id}`} className='py-1 block'>
        <div className='group w-full hover:border-2 border-transparent hover:border-teal-500 bg-gray-50 cursor-pointer rounded-lg shadow-[0px_0px_3px_rgba(12,12,13,0.4)] overflow-hidden'>
            { (card && card.cover)&& <div className='w-full h-9' style={{ backgroundColor: card.cover }}></div>}
            <div className="w-full px-2 py-2 flex break-words overflow-auto text-gray-700 ">
                <div onClick={()=>{if(UserRole.isBoardMember || UserRole.isWorkspaceMember || UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin){toggleCardStatus()}}} 
                    className={`h-auto ${(!isCompleted)?`w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 transition-all duration-300 group-hover:mr-2`:`w-auto mr-2`} mt-0.5`}>
                    {
                     (isCompleted)?
                     <GoCheckCircleFill className=" text-xl text-green-500 "/>:
                     <MdOutlineRadioButtonUnchecked className=" text-xl text-gray-500 " />
                    }
                </div>
                {card.name}
            </div>
            {
            (card && card.deadline)&&
                <div className='text-gray-500 text-xs flex items-center px-3 pb-2'>
                    <div className='mr-1'><FaRegClock /></div>
                    {new Date(card.deadline).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                    })}
                </div>
            }
        </div>
    </Link>
    )
}

export default Card