import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { RxExit } from "react-icons/rx";
import { useApi } from "../../../api/useApi";

const BoardMembers = ({boardId,setShowMembers}) => {
    const [members,setMembers] = useState([]);
    const [admin,setAdmin] = useState();
    const [loadingMembers,setLoadingMembers] = useState(true)
    const [currentUser,setCurrentUser] = useState()
    const api = useApi();

    const fetchBoardMembers = async ()=>{
        try {
            const response = await api.get(`/board/${boardId}/members`);

            setMembers(response.data.members);
            setAdmin(response.data.admin)
            setCurrentUser(response.data.currentUser)
        } catch (error) {
            console.log("Error while fetching board members ",error)
        }
        finally{
            setLoadingMembers(false)
        }
    }

    useEffect(()=>{
        fetchBoardMembers()
    },[])

  return (
    <div className="bg-white w-full p-4 h-auto rounded-lg ">
        <div className="w-full h-auto">
            <div className='w-full text-start py-1 bg-white sticky left-0 top-0'>
                <h1 className='text-lg font-semibold text-gray-700 flex items-center'>
                    <span onClick={()=>setShowMembers(false)} className='cursor-pointer p-1 mr-1'><IoIosArrowBack /></span> 
                    {`Board members (${(members||admin)?`${members.length+1}`:`0`})`}
                </h1>
            </div>
            <div className="w-full h-auto">
                { (loadingMembers)?
                (<div>Loading workspace members...</div>)
                :
                (<>
                    <MembersItem member={admin} isAdmin={true} isSelf={admin._id === currentUser._id} currentUser={currentUser} adminId={admin._id} />
                    
                    {members && members.length !== 0 && (
                    members.map((member) => {
                      if(member._id === admin._id) return null; // Skip admin as it's already rendered
                      return (
                        <MembersItem key={member._id} member={member} isAdmin={false} isSelf={member._id === currentUser._id} 
                                currentUser={currentUser} adminId={admin._id} boardId={boardId} setMembers={setMembers} />
                      )
                    })
                    )}
                </>)
                }
            </div>
        </div>
    </div>
  );
};

export default BoardMembers;


const MembersItem = ({member,isAdmin,isSelf,currentUser,adminId,boardId,setMembers})=>{
  const isCurrentUserAdmin = currentUser._id === adminId;
  const [removePopup,setRemovePopup] = useState(false);
  const [leavePopup,setLeavePopup] = useState(false);
  
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
          (isAdmin)
          ?
          <div
            className="px-2 py-1 rounded-md border-[1px] border-green-600 text-green-600 text-sm font-semibold flex items-center ">
            Admin
          </div>
          :
          (isCurrentUserAdmin && !isAdmin)?
          <div className='relative inline-block'>
            {/* <div onClick={()=>{setRemovePopup(true)}}
              className="px-2 py-1 rounded-md cursor-pointer border-[1px] border-gray-300 hover:text-gray-700 text-gray-500 text-sm font-semibold flex items-center ">
              Remove
            </div> */}
            <div onClick={()=>{setRemovePopup(true)}} className="text-base p-1 hover:bg-gray-200 rounded-md text-gray-700 flex items-center justify-center cursor-pointer ">
              <RxCross2 />
            </div>
            {
            (removePopup) && <RemoveMemberPopup setRemovePopup={setRemovePopup} userId={member._id} boardId={boardId} setMembers={setMembers} />
            }
          </div>
          :
          (isSelf && !isAdmin)?
          <div className='relative inline-block'>
            {/* <div onClick={()=>{setLeavePopup(true)}}
              className="px-2 py-1 rounded-md cursor-pointer border-[1px] border-red-500 text-red-500 text-sm font-semibold flex items-center ">
              Leave
            </div> */}
            <div onClick={()=>{setLeavePopup(true)}} className="text-base p-1 hover:bg-gray-200 rounded-md text-red-500 flex items-center justify-center cursor-pointer ">
              <RxExit />
            </div>
            {
            (leavePopup) && <LeaveBoardPopup setLeavePopup={setLeavePopup} userId={member._id} boardId={boardId} setMembers={setMembers} />
            }
          </div>
          :null
          }
        </div>
      </div>
    </div>
  )
}


const RemoveMemberPopup = ({setRemovePopup,userId,boardId,setMembers})=>{
  const divref = useRef();
  const [errorMsg,setErrorMsg] = useState("")
  const [removing,setRemoving] = useState(false);
  const api = useApi();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (divref.current && !divref.current.contains(e.target)) {
        setRemovePopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const removeMember = async ()=>{
    if(removing) return;

    try {
      setRemoving(true);

      const response = await api.post(`/board/${boardId}/remove-member`,
        {userId:userId}
      );

      setMembers(response.data.members)
      setRemovePopup(false)
    } catch (error) {
      console.log("Error in removing member ",error)
      setErrorMsg("Something went wrong.")
    }
    finally{
      setRemoving(false)
    }
  }

  return (
    <div ref={divref} className='bg-white h-fit w-64 sm:w-72 p-4 rounded-lg border-[1px] border-gray-300 
      absolute top-full right-0 shadow-[0px_0px_12px_rgba(12,12,13,0.2)]'>
      <div className='w-full h-full  '>
        <div className='w-full text-start'>
          <h1 className='font-semibold text-gray-700'>Remove member</h1>
          <p className='text-sm text-gray-400'>Once removed, this user won't be able to access this board and its card's.</p>
        </div>
        {   (errorMsg.trim()!=="") &&
          <div className='text-red-600 text-sm mt-2'>
            {errorMsg}
          </div>
        }
        <div className='w-full flex justify-between md:justify-evenly items-center mt-6'>
          <button onClick={removeMember} className='w-full py-1 bg-red-600 rounded-md text-white font-semibold outline-none border-none cursor-pointer '>
            {(removing)?'Removing...':"Remove"}
          </button>
        </div>
      </div> 
    </div>
  )
}


const LeaveBoardPopup = ({setLeavePopup,userId,boardId,setMembers})=>{
  const divref = useRef();
  const [errorMsg,setErrorMsg] = useState("")
  const [leaving,setLeaving] = useState(false);
  const api = useApi();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (divref.current && !divref.current.contains(e.target)) {
        setLeavePopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const leaveBoard = async ()=>{
    if(leaving) return;

    try {
      setLeaving(true);

      const response = await api.post(`/board/${boardId}/leave-board`,
        {userId:userId}
      );

      setMembers(response.data.members)
      setLeavePopup(false)
    } catch (error) {
      console.log("Error in Leaving board ",error)
      setErrorMsg("Something went wrong.")
    }
    finally{
      setLeaving(false)
    }
  }

  return (
    <div ref={divref} className='bg-white h-fit w-64 sm:w-72 p-4 rounded-lg border-[1px] border-gray-300 
      absolute top-full right-0 shadow-[0px_0px_12px_rgba(12,12,13,0.2)] z-40'>
      <div className='w-full h-full  '>
        <div className='w-full text-start'>
          <h1 className='font-semibold text-gray-700'>Leave board</h1>
          <p className='text-sm text-gray-400'>Once you leave, you won't be able to access this board and its card's.</p>
        </div>
        {   (errorMsg.trim()!=="") &&
          <div className='text-red-600 text-sm mt-2'>
            {errorMsg}
          </div>
        }
        <div className='w-full flex justify-between md:justify-evenly items-center mt-6'>
          <button onClick={leaveBoard} className='w-full py-1 bg-red-600 rounded-md text-white font-semibold outline-none border-none cursor-pointer '>
            {(leaving)?'...':"Leave"}
          </button>
        </div>
      </div> 
    </div>
  )
}
