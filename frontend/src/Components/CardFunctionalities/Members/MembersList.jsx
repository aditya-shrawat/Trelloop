import React, { useEffect, useRef, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { useUser } from '../../../Contexts/UserContext';
import { RxExit } from "react-icons/rx";
import { useApi } from '../../../../api/useApi';

const MembersList = ({onClose,members,cardId,UserRole,setCard}) => {
    const divref = useRef();
    const [isAdmin,setIsAdmin] = useState(false);
    const {user} = useUser()

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            onClose();
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(()=>{
        if(UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin){
            setIsAdmin(true);
        }
    },[UserRole])

  return (
    <div ref={divref} className='bg-white h-fit w-72 sm:w-80 px-4 py-4 rounded-lg border-[1px] border-gray-300 
            absolute bottom-[130%] right-0 shadow-[0px_0px_12px_rgba(12,12,13,0.2)] z-10 '>
        <div className='w-full'>
            <h3 className='pb-2 text-gray-700 font-semibold border-b-[1px] border-gray-300'>Card Members</h3>
            <div className='w-full max-h-80 overflow-auto'>
                {
                (members.length ===0 || !user) ?
                <div className='w-full py-5 text-center text-gray-500 font-semibold'>NO members !!</div> 
                :
                members?.map((member)=>(
                    <MembersItem key={member._id} member={member} isAdmin={isAdmin} isSelf={(member._id).toString() === (user._id).toString()} 
                        cardId={cardId} setCard={setCard} />
                ))
                }
            </div>
        </div>
    </div>
  )
}

export default MembersList

const MembersItem = ({member,isAdmin,isSelf,cardId,setCard})=>{
  const api = useApi();

    const removeMember = async ()=>{
        if(!isAdmin) return;
        try {
            const response = await api.patch(`/card/${cardId}/remove-member`,
                {userId:member._id});

            console.log(response.data.message)
            setCard(prevCard => ({
                ...prevCard,
                members: prevCard.members?.filter(m => (m._id).toString() !== (member._id).toString())
            }));
        } catch (error) {
            console.log("Error while removeing card member - ",error)
        }
    }

    const leaveCard = async ()=>{
        try {
            const response = await api.patch(`/card/${cardId}/leave`,
                {userId:member._id}
            );

            console.log(response.data.message)
            setCard(prevCard => ({
                ...prevCard,
                members: prevCard.members?.filter(m => (m._id).toString() !== (member._id).toString())
            }));
        } catch (error) {
            console.log("Error while leaving card - ",error)
        }
    }

  return (
    <div
      className="w-full px-1 py-2 border-b-[1px] border-gray-300 flex items-center">
      <div className=" mr-2">
        <div className="w-8 h-8 rounded-full bg-blue-300 font-semibold text-lg text-white flex justify-center items-center overflow-hidden">
          {(member.profileImage) && (<img src={member.profileImage} alt="" />)}
        </div>
      </div>
      <div className="w-full h-auto flex justify-between items-center">
        <div className="w-full h-auto">
          <h2 className="font-semibold text-gray-700 flex items-baseline line-clamp-1">{`${member.firstName} ${member.lastName}`} 
            {isSelf && <span className="text-sm text-gray-500 ml-2">(You)</span>}
          </h2>
          <h2 className="text-gray-500 text-xs line-clamp-1">@{member.username}</h2>
        </div>
        <div className="w-auto h-auto inline-block ">
          {
          (isAdmin && !isSelf)?
            <div className='w-auto h-auto ml-2'>
                <div onClick={removeMember} className="text-base text-gray-700 p-1 flex items-center justify-center cursor-pointer "><RxCross2 /></div>
            </div>
          :
          (isSelf )?
            <div className='w-auto h-auto ml-2'>
                <div onClick={leaveCard} className="text-base text-red-500 p-1 flex items-center justify-center cursor-pointer "><RxExit /></div>
            </div>
          :null
          }
        </div>
      </div>
    </div>
  )
}