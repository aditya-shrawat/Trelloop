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
    const [isCompleted,setIsCompleted] = useState(null)
    const [cardFunctionality,setCardFunctionality] = useState(null);


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
            setIsCompleted(response.data.card.isCompleted);
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


    const toggleCardStatus = async (e)=>{
        e.preventDefault();
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.patch(`${BackendURL}/card/${cardId}/isCompleted`,
                {},
            {withCredentials: true}
            );

            setIsCompleted(response.data.isCompleted)
        } catch (error) {
            console.log("Error while toggling card status - ",error)
        }
    }

  return (
    <div className="w-screen h-screen overflow-x-hidden z-20 fixed top-0 left-0 bg-[rgba(0,0,0,0.75)] ">
        <div ref={divref} className=" max-w-[95%]  md:max-w-3xl w-full py-6
                absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:flex bg-white rounded-xl border-[1px] border-gray-300 ">
            
            <div onClick={()=>{setShowCardDetails(false)}} className=' rounded-full absolute text-gray-700 top-2 right-2 cursor-pointer'>
                <AiTwotoneCloseCircle className='text-2xl ' />
            </div>
            {/* Main content */}
            <div className="flex-1 p-6 ">
                {/* Header */}
                <div className="flex items-start ">
                    <div onClick={toggleCardStatus} className='h-auto w-auto mt-1 cursor-pointer'>
                        {
                        (isCompleted)?
                            <GoCheckCircleFill className="text-2xl text-green-500" />:
                            <MdOutlineRadioButtonUnchecked className="text-2xl text-gray-700 " />
                        }
                    </div>
                    <div className="ml-3 w-full flex justify-between">
                        <div className='flex-1'>
                            { (!loadingCardInfo ) &&
                                ((!updatingCard)?
                                <h2 className="text-xl font-semibold text-gray-700">
                                    {card.name}
                                </h2>
                                :
                                <input type="text" name="name" value={newCardInfo.name} onChange={handleInput}
                                placeholder='Enter card name ...'
                                className='w-full px-2 py-1 text-lg font-semibold text-gray-700 rounded-lg outline-none border-2 border-[#49C5C5]'
                                />
                                )
                            }
                            <div className="text-sm text-gray-600 mt-1">
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
                                className=' text-gray-700 font-semibold px-2 py-0.5 cursor-pointer rounded-lg 
                                    hover:bg-gray-100 flex items-center '>
                                <BiEdit className='mr-2 text-lg' />
                                Edit card
                            </div>
                            :
                            <div className='flex items-center'>
                                {/* <div><IoCloseSharp className='text-gray-600 cursor-pointer text-2xl mr-2' /></div> */}
                                <div onClick={(e)=>{cancelUpdatingCard(e)}}
                                    className='mr-4 bg-gray-50 text-gray-700 border-[1px] border-gray-300 px-2 py-0.5 cursor-pointer rounded-lg flex items-center '>
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
                <div className="flex my-6 ">
                    <CgDetailsMore className="text-2xl mr-3 text-gray-700 mt-0" />
                    <div className="w-full ">
                        <h3 className="text-base font-medium text-gray-700 mb-2">Description</h3>
                        {(card && !updatingCard) ? 
                        (
                            (card.description !== "") ? (
                                <p className="w-full text-gray-600">
                                    {card.description}
                                </p>
                            ) : (
                                <p onClick={()=>setUpdatingCard(true)} 
                                    className="min-h-24 w-full p-2 border-[1px] border-gray-300 outline-none rounded-lg
                                    text-gray-700 bg-gray-50 hover:bg-gray-100">
                                    Add a detailed description...
                                </p>
                            )
                        ) 
                        :(
                            <textarea name='description' value={newCardInfo.description} onChange={handleInput}
                                placeholder="Add description..."
                                className="min-h-24 w-full p-2 border-2 border-[#49C5C5] outline-none rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 "
                            />
                        )
                        }
                    </div>
                </div>

                {/* Activity */}
                <div className="">
                    <div className="flex items-center justify-between mb-4 ">
                        <div className="flex items-center gap-2">
                            <TbListDetails className="text-xl mr-2 text-gray-700" />
                            <h3 className="text-base font-medium text-gray-700">Activity</h3>
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
                                className="w-full px-2 py-1 border-[1px] border-gray-300 outline-none rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 "
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
                                            <h3 className="font-semibold text-gray-700">{activity.user.name}</h3>
                                            <p className="text-sm text-gray-700 ml-1 ">
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
                     flex items-center text-gray-700">
                    <IoPersonAdd className="text-lg mr-3" />
                    Add member
                </button>

                <button className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                     flex items-center text-gray-700">
                    <IoPerson className="text-lg mr-3" />
                    Members
                </button>

                <button className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                     flex items-center text-gray-700">
                    <FaRegCalendarAlt className="text-lg mr-3" />
                    Dates
                </button>

                <div className='h-auto w-auto relative'>
                    <button onClick={()=>{setCardFunctionality("attachment")}} className=" w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                        flex items-center text-gray-700">
                        <div className='w-auto h-auto'><GrAttachment className="text-lg mr-3" /></div>
                        Attachment
                    </button>
                    {
                     (cardFunctionality==='attachment') &&
                     <AddAttachments setCardFunctionality={setCardFunctionality} />
                    }
                </div>

                <button className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                     flex items-center text-gray-700">
                    <BsLayersFill className="text-lg mr-3" />
                    Cover
                </button>
            </div>
        </div>
    </div>
  )
}

export default CardDetailsModel



const AddAttachments = ({setCardFunctionality})=>{
    return (
    <div className='bg-white h-fit w-60 lg:w-80 px-4 py-6 rounded-lg border-[1px] border-gray-300 
            absolute bottom-[130%] sm:top-[130%] right-0 shadow-[0px_0px_12px_rgba(12,12,13,0.3)] '>
        <div className='w-full h-full  '>
            <div className='w-full text-start'>
                <h1 className='text-lg font-semibold text-gray-700'>Add Attachment</h1>
                <p className='text-sm mt-1 text-gray-600'>Add a link to any file, image, or document you want to attach to this card.</p>
            </div>
            <div className='w-full text-start mt-6'>
                <label className='text-base font-semibold text-gray-700' >Paste link</label>
                <input type="link" 
                    className='w-full px-2 py-1 mt-1 border-[1px] border-gray-300 outline-none rounded-lg ' />
            </div>
            <div className='w-full flex items-center mt-6'>
                <div onClick={()=>{setCardFunctionality(null)}} className='px-4 py-0.5 rounded-lg text-gray-700 border-[1px] border-gray-300 cursor-pointer '>
                    Cancel
                </div>
                <div className='px-4 py-0.5 ml-6 bg-[#49C5C5] rounded-lg text-white font-semibold cursor-pointer '>
                    Add
                </div>
            </div>
        </div>
    </div>
    )
}


