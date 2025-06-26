import axios from 'axios';
import React from 'react'
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
          <h2 className="text-base text-gray-500 mt-2">
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
                        currentUser={currentUser} adminId={admin._id} />
              ))
            )}
          </>)
          }
        </div>
      </div>
    );
  };

export default MembersSlide

const MembersItem = ({member,isAdmin,isSelf,currentUser,adminId})=>{
  const isCurrentUserAdmin = currentUser.id === adminId;

  return (
    <div
      className="w-full px-2 py-3 border-b-[1px] border-gray-300 flex items-center">
      <div className=" mr-3">
        <div className="w-8 h-8 rounded-full bg-blue-300 font-semibold text-lg text-white flex justify-center items-center">
          {member.name[0].toUpperCase()}
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
          <div
            className="px-4 py-1 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200
              hover:text-gray-700 text-gray-500 font-semibold flex items-center ">
            Remove
          </div>
          :
          (isSelf && !isAdmin)?
          <div
            className="px-4 py-1 rounded-md cursor-pointer bg-red-200 hover:bg-red-300 text-red-600 font-semibold flex items-center ">
            Leave
          </div>
          :null
          }
        </div>
      </div>
    </div>
  )
}