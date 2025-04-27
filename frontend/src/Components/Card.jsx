import React, { useState } from 'react'
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { GoCheckCircleFill } from "react-icons/go";
import { MdModeEdit } from "react-icons/md";
import CardDetailsModel from "./CardDetailsModel";

const Card = ({card})=>{
    const [showCardDetails,setShowCardDetails] = useState(false)

    
    return (
    <div className='group relative w-full px-2 py-2 mb-3 hover:border-2 hover:border-[#49C5C5] 
        cursor-pointer rounded-lg shadow-[0px_0px_2px_rgba(12,12,13,0.4)] bg-gray-50 '>
        <div className="w-auto flex break-words overflow-auto">
            <div className="h-auto w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 transition-all duration-300 mt-1 group-hover:mr-2 ">
                {/* <MdOutlineRadioButtonUnchecked className=" text-xl text-gray-600 " /> */}
                <GoCheckCircleFill className=" text-xl text-green-500 "/>
            </div>
            {card.name}
        </div>
        <div onClick={()=>{setShowCardDetails(true)}} className="h-auto w-auto absolute top-3 right-2 opacity-0 group-hover:opacity-100 
            transition-opacity duration-300 bg-gray-50 ">
            <MdModeEdit className="text-lg text-gray-600 hover:text-[#49C5C5]"/>
        </div>
        { showCardDetails &&
            <CardDetailsModel cardId={card._id} setShowCardDetails={setShowCardDetails} />
        }
    </div>
    )
}

export default Card