import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { GoCheckCircleFill } from "react-icons/go";
import { IoPerson } from "react-icons/io5";
import { IoPersonAdd } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { BsLayersFill } from "react-icons/bs";
import { CgDetailsMore } from "react-icons/cg";
import { TbListDetails } from "react-icons/tb";
import { BiEdit } from "react-icons/bi";
import { AiTwotoneCloseCircle } from "react-icons/ai";
import axios from 'axios';

const CardDetailsModel = ({cardId,setShowCardDetails}) => {
    const divref = useRef(null);
    const [card,setCard] = useState()
    const [list,setList] = useState()
    const [loadingCardInfo,setLoadingCardInfo] = useState(true)
    const [cardActivities,setCardActivities] = useState(null)
    const [loadingCardActivities,setLoadingCardActivities] = useState(true)
    const [updatingCard,setUpdatingCard] = useState(false)
    const [newCardInfo,setNewCardInfo] = useState({name:"",description:""});
    const [errorMsg,setErrorMsg] = useState("")


    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            setShowCardDetails(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const fetchCardDetails = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/card/${cardId}`,
            {withCredentials: true}
            );

            setCard(response.data.card)
            setList(response.data.list)
            setNewCardInfo({name:response.data.card.name , description:response.data.card.description});
        } catch (error) {
            console.log("Error while fetching card details - ",error)
        }
        finally{
            setLoadingCardInfo(false)
        }
    }


    const fetchCardActivities = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/card/activities/${cardId}`,
            {withCredentials: true}
            );

            setCardActivities(response.data.activities)
        } catch (error) {
            console.log("Error while fetching card activities - ",error)
        }
        finally{
            setLoadingCardActivities(false)
        }
    }

    useEffect(()=>{
        fetchCardDetails()
        fetchCardActivities()
    },[])


    const handleInput = (e)=>{
        e.preventDefault();

        setNewCardInfo((prev)=>({...prev,[e.target.name]:e.target.value}))
    }

    const updateCardInfo = async (e)=>{
        e.preventDefault()
        if(newCardInfo.name.trim()===""){
            setErrorMsg("Card name is required!")
            return ;
        }

        setUpdatingCard(false)
        card.name = newCardInfo.name
        card.description = newCardInfo.description

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.patch(`${BackendURL}/card/${cardId}`,
                {name:newCardInfo.name,description:newCardInfo.description},
            {withCredentials: true}
            );

            card.name = response.data.card.name
            card.description = response.data.card.description
        } catch (error) {
            console.log("Error while updating card info - ",error)
        }
    }

    const cancelUpdatingCard = (e)=>{
        e.preventDefault();

        setUpdatingCard(false);
        setErrorMsg('')
        setNewCardInfo({name:card.name,description:card.description})
    }


  return (
    <div className="w-screen h-screen overflow-x-hidden z-20 fixed top-0 left-0 bg-[rgba(0,0,0,0.75)] ">
        <div ref={divref} className=" max-w-[95%]  md:max-w-3xl w-full py-6
                absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:flex bg-white rounded-xl border-[1px] border-gray-300 ">
            
            <div onClick={()=>{setShowCardDetails(false)}} className=' rounded-full absolute text-gray-600 top-2 right-2 cursor-pointer'>
                <AiTwotoneCloseCircle className='text-2xl ' />
            </div>
            {/* Main content */}
            <div className="flex-1 p-6 ">
                {/* Header */}
                <div className="flex items-start ">
                    <GoCheckCircleFill className="w-5 h-5 mt-1 text-green-500" />
                    <div className="ml-3 w-full flex justify-between">
                        <div className='flex-1'>
                            { (!loadingCardInfo ) &&
                                ((!updatingCard)?
                                <h2 className="text-xl font-semibold text-gray-600">
                                    {card.name}
                                </h2>
                                :
                                <input type="text" name="name" value={newCardInfo.name} onChange={handleInput}
                                placeholder='Enter card name ...'
                                className='w-full px-2 py-1 text-lg font-semibold text-gray-600 rounded-lg outline-none border-2 border-[#49C5C5]'
                                />
                                )
                            }
                            <div className="text-sm text-gray-500 mt-1">
                                in list{" "}
                                { (!loadingCardInfo) &&
                                <span className="bg-gray-100 px-2 py-0.5 rounded">
                                    {list.name} 
                                </span>
                                }
                            </div>
                            {
                            <div className='text-red-600'>
                                {errorMsg}
                            </div>
                            }
                        </div>

                        <div className='w-auto ml-4 '>
                            { (!updatingCard) ?
                            <div onClick={()=>{setUpdatingCard(true)}}
                                className=' text-gray-600 font-semibold px-2 py-0.5 cursor-pointer rounded-lg 
                                    hover:bg-gray-100 flex items-center '>
                                <BiEdit className='mr-2 text-lg' />
                                Edit card
                            </div>
                            :
                            <div className='flex items-center'>
                                {/* <div><IoCloseSharp className='text-gray-600 cursor-pointer text-2xl mr-2' /></div> */}
                                <div onClick={(e)=>{cancelUpdatingCard(e)}}
                                    className='mr-4 bg-gray-50 text-gray-600 border-[1px] border-gray-300 font-semibold px-2 py-0.5 cursor-pointer rounded-lg flex items-center '>
                                    Cancel
                                </div>
                                <div onClick={updateCardInfo}
                                    className='bg-[#49C5C5] text-white font-semibold px-2 py-0.5 cursor-pointer rounded-lg flex items-center '>
                                    Save
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="flex my-4 ">
                    <CgDetailsMore className="text-lg mr-3 text-gray-600 mt-1" />
                    <div className="w-full ">
                        <h3 className="text-base font-medium text-gray-600 mb-2">Description</h3>
                        {(card && !updatingCard) ? 
                        (
                            (card.description !== "") ? (
                                <p className="w-full text-gray-600">
                                    {card.description}
                                </p>
                            ) : (
                                <p onClick={()=>setUpdatingCard(true)} 
                                    className="min-h-24 w-full p-2 border-[1px] border-gray-300 outline-none rounded-lg
                                    text-gray-600 bg-gray-50 hover:bg-gray-100">
                                    Add a detailed description...
                                </p>
                            )
                        ) 
                        :(
                            <textarea name='description' value={newCardInfo.description} onChange={handleInput}
                                placeholder="Add description..."
                                className="min-h-24 w-full p-2 border-2 border-[#49C5C5] outline-none rounded-lg text-gray-600 bg-gray-50 hover:bg-gray-100 "
                            />
                        )
                        }
                    </div>
                </div>

                {/* Activity */}
                <div className="">
                    <div className="flex items-center justify-between mb-4 ">
                        <div className="flex items-center gap-2">
                            <TbListDetails className="text-lg mr-2 text-gray-600" />
                            <h3 className="text-base font-medium text-gray-600">Activity</h3>
                        </div>
                    </div>

                    
                    <div className="w-full h-full ">
                        <div className="flex ">
                            <div className='h-auto w-auto mr-3'>
                                <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center">
                                    <span className=" font-semibold text-white">AS</span>
                                </div>
                            </div>
                            <input placeholder="Write a comment..." 
                                className="w-full px-2 py-1 border-[1px] border-gray-300 outline-none rounded-lg text-gray-600 bg-gray-50 hover:bg-gray-100 "
                            />
                        </div>

                        { (loadingCardActivities) ?
                            <div>Loading activity</div> :
                            (
                            (
                            cardActivities.map((activity,index)=>(
                                <div key={index} className='w-full flex mt-4'>
                                    <div className='h-auto w-auto mr-3'>
                                        <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center">
                                            <span className=" font-semibold text-white">PS</span>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div className='w-full flex items-baseline mb-1'>
                                            <h3 className="font-semibold text-gray-600">{activity.user.name}</h3>
                                            <p className="text-sm text-gray-600 ml-1 ">
                                                {activity.message}
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500">{activity.createdAt}</p>
                                    </div>
                                </div>
                            ))
                            )
                        )
                        }

                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="sm:w-52 mt-4 sm:mt-none p-6 sm:pr-6 sm:p-2
                    space-y-4 grid grid-cols-2 gap-x-4 sm:flex sm:flex-col ">
                <button className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                     flex items-center text-gray-600">
                    <IoPersonAdd className="text-lg mr-3" />
                    Add member
                </button>

                <button className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                     flex items-center text-gray-600">
                    <IoPerson className="text-lg mr-3" />
                    Members
                </button>

                <button className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                     flex items-center text-gray-600">
                    <FaRegCalendarAlt className="text-lg mr-3" />
                    Dates
                </button>

                <button className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                     flex items-center text-gray-600">
                    <GrAttachment className="text-lg mr-3" />
                    Attachment
                </button>

                <button className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                     flex items-center text-gray-600">
                    <BsLayersFill className="text-lg mr-3" />
                    Cover
                </button>
            </div>
        </div>
    </div>
  )
}

export default CardDetailsModel