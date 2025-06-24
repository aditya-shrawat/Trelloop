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

  const fetchWorkspaceMembers = async ()=>{
    try {
      const BackendURL = import.meta.env.VITE_BackendURL;
      const response = await axios.get(`${BackendURL}/workspace/${name}/${id}/members`,
        {withCredentials: true}
      );

      setMembers(response.data.members);
      setAdmin(response.data.admin)
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
        <div className="mt-4 w-full h-auto ">
          { (loadingMembers)?
          (<div>Loading workspace members...</div>)
          :
          (<>
            <MembersItem user={admin} isAdmin={true} />
            {members && members.length !== 0 && (
              members.map((user) => (
                <MembersItem key={user._id} user={user} isAdmin={true} />
              ))
            )}
          </>)
          }
        </div>
      </div>
    );
  };

export default MembersSlide

const MembersItem = ({user,isAdmin})=>{
  return (
    <div
      className="w-full py-4 border-b-[1px] border-gray-300 flex items-center">
      <div className=" mr-3">
        <div className="w-8 h-8 rounded-full bg-blue-300 font-semibold text-lg text-white flex justify-center items-center">
          {user.name[0].toUpperCase()}
        </div>
      </div>
      <div className="w-full h-auto flex justify-between items-center">
        <div className="w-full h-auto">
          <h2 className="font-semibold text-gray-700">{`${user.name}`}</h2>
          {/* <h2 className="text-gray-500 text-[14px]">@adityashrawat</h2> */}
        </div>
        <div className="w-auto h-auto inline-block ">
          {
          (isAdmin)
          ?
          <div
            className="px-1 py-[0.5px] rounded-md cursor-pointer bg-green-200 border-[1px] border-green-500 
              text-gray-700 font-semibold flex items-center ">
            Admin
          </div>
          :
          <div
            className="px-1 py-[0.5px] rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 border-[1px] border-gray-300 
              hover:text-gray-700 text-gray-500 font-semibold flex items-center ">
            <RxCross2 className="mr-1 text-lg" /> Remove
          </div>
          }
        </div>
      </div>
    </div>
  )
}