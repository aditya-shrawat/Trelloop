import axios from 'axios';
import React from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { useParams } from 'react-router-dom';

const MembersSlide = () => {
  const {name,id} = useParams();
  const [members,setMembers] = useState([]);
  const [admin,setAdmin] = useState();
  const [loadingMembers,setLoadingMembers] = useState(true)
  const [currentUser,setCurrentUser] = useState()

  const fetchWorkspaceMembers = async ()=>{
    try {
      const BackendURL = import.meta.env.VITE_BackendURL;
      const response = await axios.get(`${BackendURL}/workspace/${name}/${id}/members`,
        {withCredentials: true}
      );

      setMembers(response.data.members);
      setAdmin(response.data.admin)
      setCurrentUser(response.data.currentUser)
    } catch (error) {
      console.log("Error while fetching workspace members ",error)
    }
    finally{
      setLoadingMembers(false)
    }
  }

  useEffect(()=>{
    fetchWorkspaceMembers()
  },[])


    return (
      <div className="w-full h-auto">
        <div className="pb-6 border-b-[1px] border-gray-300 ">
          <h2 className="text-xl font-semibold text-gray-700">{`Workspace members (${(members||admin)?`${members.length+1}`:`0`})`}</h2>
          <h2 className="text-sm text-gray-400 ">
            Workspace members can view and join all Workspace visible boards and
            create new boards in the Workspace.
          </h2>
        </div>
        <div className="w-full h-auto ">
          { (loadingMembers)?
          (<div>Loading workspace members...</div>)
          :
          (<>
            <MembersItem member={admin} isAdmin={true} isSelf={admin._id === currentUser.id} currentUser={currentUser} adminId={admin._id} />
            
            {members && members.length !== 0 && (
              members.map((member) => (
                <MembersItem key={member._id} member={member} isAdmin={false} isSelf={member._id === currentUser.id} 
                        currentUser={currentUser} adminId={admin._id} workspaceId={id} setMembers={setMembers} />
              ))
            )}
          </>)
          }
        </div>
      </div>
    );
  };

export default MembersSlide

const MembersItem = ({member,isAdmin,isSelf,currentUser,adminId,workspaceId,setMembers})=>{
  const isCurrentUserAdmin = currentUser.id === adminId;
  const [removePopup,setRemovePopup] = useState(false);
  const [leavePopup,setLeavePopup] = useState(false);
  
  return (
    <div
      className="w-full px-2 py-3 border-b-[1px] border-gray-300 flex items-center">
      <div className=" mr-3">
        <div className="w-8 h-8 rounded-full bg-blue-300 font-semibold text-lg text-white flex justify-center items-center">
          {(member.name) && (member.name[0].toUpperCase())}
        </div>
      </div>
      <div className="w-full h-auto flex justify-between items-center">
        <div className="w-full h-auto">
          <h2 className="font-semibold text-gray-700 flex items-baseline">{`${member.name}`} 
            {isSelf && <span className="text-sm text-gray-500 ml-2">(You)</span>}
          </h2>
          <h2 className="text-gray-500 text-sm">@username</h2>
        </div>
        <div className="w-auto h-auto inline-block ">
          {
          (isAdmin)
          ?
          <div
            className="px-4 py-1 rounded-md bg-green-200 text-green-800 font-semibold flex items-center ">
            Admin
          </div>
          :
          (isCurrentUserAdmin && !isAdmin)?
          <div className='relative inline-block'>
            <div onClick={()=>{setRemovePopup(true)}}
              className="px-4 py-1 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200
                hover:text-gray-700 text-gray-500 font-semibold flex items-center ">
              Remove
            </div>
            {
            (removePopup) && <RemoveMemberPopup setRemovePopup={setRemovePopup} userId={member._id} workspaceId={workspaceId} setMembers={setMembers} />
            }
          </div>
          :
          (isSelf && !isAdmin)?
          <div className='relative inline-block'>
            <div onClick={()=>{setLeavePopup(true)}}
              className="px-4 py-1 rounded-md cursor-pointer bg-red-200 hover:bg-red-300 text-red-600 font-semibold flex items-center ">
              Leave
            </div>
            {
            (leavePopup) && <LeaveWorkspacePopup setLeavePopup={setLeavePopup} userId={member._id} workspaceId={workspaceId} setMembers={setMembers} />
            }
          </div>
          :null
          }
        </div>
      </div>
    </div>
  )
}


const RemoveMemberPopup = ({setRemovePopup,userId,workspaceId,setMembers})=>{
  const divref = useRef();
  const [errorMsg,setErrorMsg] = useState("")
  const [removing,setRemoving] = useState(false);

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

      const BackendURL = import.meta.env.VITE_BackendURL;
      const response = await axios.post(`${BackendURL}/workspace/${workspaceId}/remove-member`,
        {userId:userId},
        {withCredentials: true}
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
    <div ref={divref} className='bg-white h-fit w-72 p-4 rounded-lg border-[1px] border-gray-300 
      absolute bottom-full right-0 shadow-[0px_0px_12px_rgba(12,12,13,0.2)] z-10'>
      <div className='w-full h-full  '>
        <div className='w-full text-start'>
          <h1 className='text-lg font-semibold text-gray-700'>Remove member</h1>
          <p className='text-sm text-gray-400'>Once removed, this user won't be able to access this workspace or its boards.</p>
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


const LeaveWorkspacePopup = ({setLeavePopup,userId,workspaceId,setMembers})=>{
  const divref = useRef();
  const [errorMsg,setErrorMsg] = useState("")
  const [leaving,setLeaving] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (divref.current && !divref.current.contains(e.target)) {
        setLeavePopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const leaveWorkspace = async ()=>{
    if(leaving) return;

    try {
      setLeaving(true);

      const BackendURL = import.meta.env.VITE_BackendURL;
      const response = await axios.post(`${BackendURL}/workspace/${workspaceId}/leave-workspace`,
        {userId:userId},
        {withCredentials: true}
      );

      setMembers(response.data.members)
      setLeavePopup(false)
    } catch (error) {
      console.log("Error in Leaving workspace ",error)
      setErrorMsg("Something went wrong.")
    }
    finally{
      setLeaving(false)
    }
  }

  return (
    <div ref={divref} className='bg-white h-fit w-72 p-4 rounded-lg border-[1px] border-gray-300 
      absolute bottom-full right-0 shadow-[0px_0px_12px_rgba(12,12,13,0.2)] z-10'>
      <div className='w-full h-full  '>
        <div className='w-full text-start'>
          <h1 className='text-lg font-semibold text-gray-700'>Leave workspace</h1>
          <p className='text-sm text-gray-400'>Once you leave, you won't be able to access this workspace or its boards.</p>
        </div>
        {   (errorMsg.trim()!=="") &&
          <div className='text-red-600 text-sm mt-2'>
            {errorMsg}
          </div>
        }
        <div className='w-full flex justify-between md:justify-evenly items-center mt-6'>
          <button onClick={leaveWorkspace} className='w-full py-1 bg-red-600 rounded-md text-white font-semibold outline-none border-none cursor-pointer '>
            {(leaving)?'...':"Leave"}
          </button>
        </div>
      </div> 
    </div>
  )
}