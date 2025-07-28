import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import socket from "../../Socket/socket";
import useWorkspaceSocket from "../../Socket/useWorkspaceSocket"


const AddNewMembers = ({setIsAddingNewMembers,workspace}) => {
  const divref = useRef(null);
  const [inputString,setInputString] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchedUsers,setSearchedUsers] = useState([]);
  const [workspaceMembers,setWorkspaceMembers] = useState([]);
  const [selectedUsersInfo,setSelectedUsersInfo] = useState([]);
  const [selectedUsersIds,setSelectedUsersIds] = useState([]);
  const [admin,setAdmin] = useState();
  const [sendingInvite,setSendingInvite] = useState(false)
  
  // join workspace room
  useWorkspaceSocket (socket,workspace.id,{});

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (divref.current && !divref.current.contains(e.target)) {
        setIsAddingNewMembers(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchworkspaceMembers = async ()=>{
    try {
        const BackendURL = import.meta.env.VITE_BackendURL;
        const response = await axios.get(`${BackendURL}/workspace/${workspace.name}/${workspace.id}/members`,
            {withCredentials: true}
        );

        setAdmin(response.data.admin)
        setWorkspaceMembers([response.data.admin, ...response.data.members]);
    } catch (error) {
        console.log("Error in fetching workspace members - ",error)
    }
  }

  useEffect(()=>{
    if(!workspace) return ;

    fetchworkspaceMembers()
  },[workspace])

  const searchUsers = async (e) => {
    e.preventDefault();

    const value = e.target.value.trim();
    setInputString(e.target.value) ;

    if(value===''){
        setSearchedUsers([])
        return null;
    }

    try {
        const BackendURL = import.meta.env.VITE_BackendURL;
        const response = await axios.get(`${BackendURL}/search/global-users?query=${value}`,
            {withCredentials: true}
        );

        setSearchedUsers(response.data.users);
    } catch (error) {
        console.log("Error in searching users - ",error)
        setErrorMsg("Something went wrong, try again.")
    }
  };

  const checkIsAlreadyMember = (user)=>{
    return workspaceMembers.some(
        (member) => member._id === user._id
    );
  }

  const checkIsAlreadySelected = (user)=>{
    return selectedUsersInfo.some(
        (u) => u._id === user._id
    );
  }

  const selectingUsers = (user)=>{
    const isAlreadyMember = checkIsAlreadyMember(user);
    const isAlreadySelected = checkIsAlreadySelected(user);

    if(isAlreadyMember || isAlreadySelected) return;

    setSelectedUsersIds((prev)=>[...prev,user._id]);
    setSelectedUsersInfo((prev)=>[...prev,user]);
  }

  const removeSelectedUser = (user) => {
    setSelectedUsersInfo((prev) =>
        prev.filter((u) => u._id !== user._id)
    );
    setSelectedUsersIds((prev) =>
        prev.filter((id) => id !== user._id)
    );
  };

  const sendInviteToSelectedUsers = (e)=>{
    e.preventDefault()
    if(sendingInvite) return ;
    if((selectedUsersIds.length===0 && selectedUsersInfo.length===0)) return;

    setSendingInvite(true);

    try {
      socket.emit("send_workspace_invite", {
        workspaceId:workspace.id,
        userIds:selectedUsersIds,
        senderId: admin._id,
      });

      socket.once("workspace_invite_sent", (data) => {
        console.log("invitation data : ", data);
      });
    } catch (error) {
        console.log("Error while sending invitation - ",error)
    }
    finally{
        setSelectedUsersIds([])
        setSelectedUsersIds([])
        setIsAddingNewMembers(false)
      setSendingInvite(false)
    }
  }


  return (
    <div className="w-screen h-screen overflow-x-hidden z-20 fixed top-0 left-0 bg-[rgba(0,0,0,0.75)] ">
      <div ref={divref}
        className="max-w-[95%] sm:max-w-md md:max-w-lg w-full 
            absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-4 sm:px-6 py-6 sm:py-8 bg-white rounded-lg border-[1px] border-gray-300 ">
        <div className="w-full h-auto">
          <h1 className="text-xl font-semibold text-gray-700 ">
            Add Members to Your Workspace
          </h1>
          <h3 className="text-gray-400 text-sm">
            Collaborate better by inviting teammates to your workspace and work together seamlessly.
          </h3>
        </div>
        <form className="w-full h-auto">
          <div className="flex flex-col mt-4">
            <label className="mb-1 font-semibold text-gray-700">
              Invite members
            </label>
            <input type="text" name="name" value={inputString} onChange={searchUsers} placeholder="Enter name"
              className=" h-10 py-2 px-2 text-base text-gray-700 rounded-md border-[1px] border-gray-300 outline-none"
            />
          </div>
          {(selectedUsersInfo.length!==0) &&
            <div className="mt-4 p-2 text-gray-500 border-[1px] border-teal-600 rounded-md flex gap-2 overflow-y-auto">
                {
                selectedUsersInfo.map((user)=>{
                    return <SelectedUserItem key={user._id} user={user} onRemove={removeSelectedUser} />
                })}
            </div>
          }
          {
            (searchedUsers.length ===0 && inputString!=='') &&
            <div className="mt-4 p-2 text-gray-500 border-[1px] border-gray-300 rounded-md">
                Not found
            </div>
          }         
          {
            (searchedUsers.length!==0) &&
            <div className="flex flex-col p-2 mt-4 max-h-64 overflow-y-auto border-[1px] border-gray-300 rounded-md">
                {
                (searchedUsers && searchedUsers.length !== 0) &&
                searchedUsers.map((user)=>{
                    const isAlreadyMember = checkIsAlreadyMember(user);
                    return <UserItem key={user._id} user={user} isAlreadyMember={isAlreadyMember} selectingUsers={selectingUsers}
                        checkIsAlreadySelected={checkIsAlreadySelected} />
                })
                }
            </div>
          }
          {errorMsg.trim() !== "" && (
            <div className="flex flex-col mt-2 text-red-500">{errorMsg}</div>
          )}
          <div className="mt-6">
            <button onClick={sendInviteToSelectedUsers}
              className={`w-full py-2  ${(selectedUsersIds.length!==0 && selectedUsersInfo.length!==0)?`bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl cursor-pointer`
                :`bg-teal-500 cursor-not-allowed`} 
                font-semibold text-lg text-white rounded-md outline-none border-none`}>
              {(sendingInvite)?"Inviting...":"Send invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewMembers;


const UserItem = ({user,isAlreadyMember,selectingUsers,checkIsAlreadySelected})=>{
    const isAlreadySelected = checkIsAlreadySelected(user);
    return (
        <div onClick={()=>{selectingUsers(user)}} className={`w-full p-2 my-1 rounded-lg 
            ${(isAlreadyMember || isAlreadySelected)?`bg-gray-200 pointer-events-none cursor-not-allowed`:`hover:bg-gray-200 cursor-pointer`} flex items-center`}>
            <div className=" mr-3">
                <div className="w-8 h-8 rounded-full bg-blue-300 font-semibold text-lg text-white flex justify-center items-center">
                  {user.name[0].toUpperCase()}
                </div>
            </div>
            <div className="w-full h-auto">
                <h2 className="font-semibold text-gray-700">{user.name}</h2>
                { 
                (isAlreadyMember) &&
                <h2 className="text-gray-500 text-[12px]">Already a member.</h2>
                }
            </div>
        </div>
    )
}

const SelectedUserItem = ({user,onRemove})=>{
    return (
        <div className="px-1 py-[0.5px] border-[1px] border-gray-300 rounded-md text-gray-500 text-sm flex ">
            <h3 className="mr-1">{user.name}</h3>
            <div onClick={()=>{onRemove(user)}} className="text-base px-1 flex items-center justify-center cursor-pointer "><RxCross2 /></div>
        </div>
    )
}
