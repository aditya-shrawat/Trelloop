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
import { useNavigate, useParams } from 'react-router-dom';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useUser } from '../Contexts/UserContext';
import AddAttachments from './CardFunctionalities/Attachment/AddAttachments';
import AttachmentContainer from './CardFunctionalities/Attachment/AttachmentContainer';
import DeleteCard from './CardFunctionalities/Delete card/DeleteCard';
import { RiDeleteBin6Line } from "react-icons/ri";
import DatePicker from './CardFunctionalities/Date/DatePicker';
import MembersList from './CardFunctionalities/Members/MembersList';
import AddMemberToCard from './CardFunctionalities/Members/AddMemberToCard';
import { RiAddLargeFill } from "react-icons/ri";

dayjs.extend(relativeTime);

const CardDetailsModel = () => {
    const {id} = useParams()
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
    const [attachments,setAttachments] = useState([])
    const navigate = useNavigate();
    const [board,setBoard] = useState()
    const {user} = useUser()
    const [UserRole,setUserRole] = useState({
                                isCardMember:undefined,
                                isBoardMember: undefined,
                                isWorkspaceMember: undefined,
                                isBoardAdmin: undefined,
                                isWorkspaceAdmin: undefined
                            });

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            navigate(-1)
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const fetchCardDetails = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/card/${id}`,
            {withCredentials: true}
            );

            setCard(response.data.card)
            setList(response.data.list)
            setNewCardInfo({name:response.data.card.name , description:response.data.card.description});
            setIsCompleted(response.data.card.isCompleted);
            setAttachments(response.data.card.attachments);
            setBoard(response.data.board);
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
            const response = await axios.get(`${BackendURL}/card/activities/${id}`,
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

    useEffect(() => {
        if (board && user && card) {
            const workspace = board.workspace;
            const userId = user.id?.toString();

            const isBoardMember = board.members?.some(id => id.toString() === userId);
            const isWorkspaceMember = workspace.members?.some(id => id.toString() === userId);
            const isBoardAdmin = board.admin._id?.toString() === userId;
            const isWorkspaceAdmin = workspace.createdBy?.toString() === userId;
            const isCardMember = card.members?.some(user => user._id?.toString() === userId);

            setUserRole({
                    isCardMember,
                    isBoardMember,
                    isWorkspaceMember,
                    isBoardAdmin,
                    isWorkspaceAdmin
                });
        }
    }, [board,user,card]);


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
            const response = await axios.patch(`${BackendURL}/card/${id}`,
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
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.patch(`${BackendURL}/card/${id}/isCompleted`,
                {},
            {withCredentials: true}
            );

            setIsCompleted(response.data.isCompleted)
        } catch (error) {
            console.log("Error while toggling card status - ",error)
        }
    }

    const deadlineStatusMessage = (cardDeadline)=>{
        const today = new Date();
        const deadline = new Date(cardDeadline);

        today.setHours(0, 0, 0, 0);
        deadline.setHours(0, 0, 0, 0);

        const diffDays = (deadline - today) / (1000 * 60 * 60 * 24);

        if (diffDays < 0) {
            return <span className="bg-red-500 text-white ml-2 text-xs px-1 rounded-sm">Overdue</span>;
        } else if (diffDays === 0 || diffDays === 1) {
            return <span className="bg-orange-500 text-white ml-2 text-xs px-1 rounded-sm">Due Soon</span>;
        } else {
            return null;
        }
    }

    const joinCard = async ()=>{
        if(UserRole.isCardMember){
            console.log("You are already a member of card.")
            return;
        }
        if(!card) return;

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.patch(`${BackendURL}/card/${card._id}/join`,
                {},
            {withCredentials: true}
            );

            console.log(response.data.message)
            setUserRole((prev)=>({...prev,isCardMember:true}));
        } catch (error) {
            console.log("Error in joining card - ",error)
        }
    }

  return (
    <div className="w-screen h-screen overflow-x-hidden z-20 fixed top-0 left-0 bg-[rgba(0,0,0,0.75)] ">
        <div ref={divref} className=" max-w-[95%]  md:max-w-3xl w-full py-6
                mx-auto my-10 md:my-20 sm:flex bg-white rounded-xl border-[1px] border-gray-300 relative">
            
            <div onClick={()=>{navigate(-1)}} className=' rounded-full absolute text-gray-700 top-2 right-2 cursor-pointer'>
                <AiTwotoneCloseCircle className='text-2xl ' />
            </div>
            {/* Main content */}
            <div className="flex-1 p-6 ">
                {/* Header */}
                <div className="flex items-start ">
                    <div onClick={()=>{if(UserRole.isBoardMember || UserRole.isWorkspaceMember || UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin){toggleCardStatus()}}}
                        className='h-auto w-auto mt-1 cursor-pointer'>
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
                            { (errorMsg.trim()!=='') &&
                            <div className='text-red-600'>
                                {errorMsg}
                            </div>
                            }
                        </div>

                        { (board && (UserRole.isBoardMember || UserRole.isWorkspaceMember || UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin)) &&
                        (<div className='w-auto ml-4 '>
                            { (!updatingCard) ?
                            <div onClick={()=>{setUpdatingCard(true)}}
                                className=' text-gray-700 font-semibold px-2 py-0.5 cursor-pointer rounded-lg 
                                    hover:bg-gray-100 flex items-center '>
                                <BiEdit className='mr-2 text-lg' />
                                Edit card
                            </div>
                            :
                            <div className='flex items-center'>
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
                        </div>)}
                    </div>
                </div>

                { (card && card.deadline) &&
                    <div className='pl-9 my-6 w-full'>
                        <div className='w-full'>
                            <h3 className="text-sm text-gray-500 ">Deadline</h3>
                            <div className='text-gray-700 font-medium text-base flex items-center'>
                                {new Date(card.deadline).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                })}
                                {deadlineStatusMessage(card.deadline)}
                            </div>
                        </div>
                    </div>
                }

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

                {/* Attachments */}
                {
                    (card && card.attachments.length > 0) &&
                    <div className="flex my-6 ">
                        <GrAttachment className="text-xl mr-3 text-gray-700 mt-0" />
                        <div className="w-full ">
                            <h3 className="text-base font-medium text-gray-700 ">Attachment</h3>
                            <div className='w-full '>
                                {
                                  attachments.map((link,index)=>(
                                    <AttachmentContainer key={index} link={link} setAttachments={setAttachments} index={index} />
                                  ))
                                }
                            </div>
                        </div>
                    </div>
                }

                {/* Activity */}
                <div className="">
                    <div className="flex items-center justify-between mb-4 ">
                        <div className="flex items-center gap-2">
                            <TbListDetails className="text-xl mr-2 text-gray-700" />
                            <h3 className="text-base font-medium text-gray-700">Activity</h3>
                        </div>
                    </div> 
                    <div className="w-full h-full space-y-4 ">
                        {(board && (UserRole.isBoardMember || UserRole.isWorkspaceMember || UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin)) &&
                        (<div className="flex ">
                            <div className='h-auto w-auto mr-3'>
                                <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center">
                                    <span className=" font-semibold text-white">AS</span>
                                </div>
                            </div>
                            <input placeholder="Write a comment..." 
                                className="w-full px-2 py-1 border-[1px] border-gray-300 outline-none rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 "
                            />
                        </div>)}
                        { (loadingCardActivities) ?
                            <div>Loading activity</div> :
                            (cardActivities.map((activity)=>(
                                <ActivityItem key={activity._id} activity={activity}  />
                            )))
                        }
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="sm:w-52 mt-4 sm:mt-none p-6 sm:pr-6 sm:p-2
                    space-y-4 grid grid-cols-2 gap-x-4 sm:flex sm:flex-col ">
                {(board && (UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin)) &&
                    (<div className='relative'>
                        <button onClick={()=>{setCardFunctionality("addMember")}} className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                            flex items-center text-gray-700">
                            <RiAddLargeFill className="text-lg mr-3" />
                            Add member
                        </button>

                        { (board && card && cardFunctionality==='addMember' )&& 
                            <AddMemberToCard onClose={() => setCardFunctionality(null)} cardId={card._id} cardMembers={card.members} boardId={board._id} />
                        }
                    </div>)
                }

                { (board && ((UserRole.isBoardMember || UserRole.isBoardAdmin ||UserRole.isWorkspaceAdmin ||UserRole.isWorkspaceMember) && !UserRole.isCardMember) ) && 
                    <button onClick={joinCard} className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                        flex items-center text-gray-700">
                        <IoPersonAdd className="text-lg mr-3" />
                        Join
                    </button>
                }

                <div className='relative'>
                    <button onClick={()=>{setCardFunctionality("members")}} className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                        flex items-center text-gray-700">
                        <IoPerson className="text-lg mr-3" />
                        Members
                    </button>

                    { (card && cardFunctionality==='members' )&& <MembersList onClose={() => setCardFunctionality(null)} members={card.members} cardId={card._id} UserRole={UserRole} setCard={setCard} />}
                </div>

                {(board && (UserRole.isBoardMember || UserRole.isWorkspaceMember || UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin)) &&
                    <div className='relative'>
                        <button onClick={()=>{setCardFunctionality("datePicker")}} className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                            flex items-center text-gray-700">
                            <FaRegCalendarAlt className="text-lg mr-3" />
                            Dates
                        </button>

                        { (card && cardFunctionality==='datePicker' )&& <DatePicker onClose={() => setCardFunctionality(null)} cardId={card._id} setCard={setCard} />}
                    </div>
                }

                {(board && card && (UserRole.isBoardMember || UserRole.isWorkspaceMember || UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin)) &&
                (<>
                <div className='h-auto w-auto relative'>
                    <button onClick={()=>{setCardFunctionality("attachment")}} className=" w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                        flex items-center text-gray-700">
                        <div className='w-auto h-auto'><GrAttachment className="text-lg mr-3" /></div>
                        Attachment
                    </button>
                    {
                     (cardFunctionality==='attachment') &&
                     <AddAttachments setCardFunctionality={setCardFunctionality} setAttachments={setAttachments} cardId={id} />
                    }
                </div>

                <button className="w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                     flex items-center text-gray-700">
                    <BsLayersFill className="text-lg mr-3" />
                    Cover
                </button>
                </>)}

                {(board && card && (UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin)) &&
                    <div className='h-auto w-auto relative'>
                        <button onClick={()=>{setCardFunctionality("delete")}} className=" w-full bg-gray-50 border-[1px] border-gray-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100
                            flex items-center text-gray-700 hover:text-red-600">
                            <div className='w-auto h-auto'><RiDeleteBin6Line className="text-lg mr-3" /></div>
                            Delete card
                        </button>
                        {
                        (cardFunctionality==='delete') &&
                        <DeleteCard setCardFunctionality={setCardFunctionality} cardId={id} />
                        }
                    </div>
                }
            </div>
        </div>
    </div>
  )
}

export default CardDetailsModel


const ActivityItem = ({activity})=>{
    const createdAt = dayjs(activity.createdAt);
    const now = dayjs();
    const diffInHours = now.diff(createdAt, 'hour');
    const displayTime = diffInHours < 24 ? createdAt.fromNow() : createdAt.format('MMM DD, YYYY, hh:mm A');


    const getActivityMessage =(activity)=> {
        const { type, data } = activity;

        switch (type) {
            case "card_created":
            return `added the card to list "${data.list_name}"`;

            case "card_renamed":
            return `renamed the card from "${data.card_oldName}" to "${data.card_newName}".`;

            case "card_newInfo":
            return `updated the card name "${data.card_oldName}" to "${data.card_newName}" and updated description.`;

            case "card_newDesc":
            return `updated the card description.`;

            case "card_deadline_changed":
            return `updated the card deadline.`;

            case "card_marked":
            return `marked the card as ${(data.isCompleted)?`complete`:`incomplete`}.`

            case "card_attachment":
                if(data.actionType==='added'){
                    return `added "${data.newAttachment}" to attachments.`; 
                }
                else if(data.actionType==='updated'){
                    return `updated "${data.oldAttachment}" to "${data.newAttachment}".`; 
                }
                else if(data.actionType==='deleted'){
                    return `deleted "${data.removedAttachment}" from attachments.`; 
                }
            break;

            default:
            return `performed an action.`;
        }
    }

    return (
        <div className='w-full flex '>
            <div className='h-auto w-auto mr-2'>
                <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center">
                    <span className="font-semibold text-white text-lg ">
                        {activity.user.name && activity.user.name[0].toUpperCase()}
                    </span>
                </div>
            </div>
            <div className="w-full">
                <div className='w-full text-sm text-gray-700'>
                    <span className="font-semibold mr-1">{activity.user.name}</span>{getActivityMessage(activity)}
                </div>
                <p className="text-xs text-gray-500">
                    {displayTime}
                </p>
            </div>
        </div>
    )
}

