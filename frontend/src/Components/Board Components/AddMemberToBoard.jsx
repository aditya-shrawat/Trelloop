import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import { useUser } from "../../Contexts/UserContext";
import socket from "../../Socket/socket";
import useBoardSocket from "../../Socket/useBoardSocket";
import { useApi } from "../../../api/useApi";


const AddMemberToBoard = ({setIsAddingNewMembers,board}) => {
  const divref = useRef(null);
  const [inputString,setInputString] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchedUsers,setSearchedUsers] = useState([]);
  const [boardMembers,setBoardMembers] = useState([]);
  const [selectedUsersInfo,setSelectedUsersInfo] = useState([]);
  const [selectedUsersIds,setSelectedUsersIds] = useState([]);
  const [workspaceMembers,setWorkspaceMembers] = useState([]);
  const [selectFrom,setSelectFrom] = useState('Workspace');
  const {user} = useUser()
  const api = useApi();

  useBoardSocket(socket,board._id);

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
        const response = await api.get(`/workspace/${board.workspace.name}/${board.workspace._id}/members`);

        setWorkspaceMembers([response.data.admin, ...response.data.members]);
    } catch (error) {
        console.log("Error in fetching workspace members - ",error)
    }
  }

  useEffect(()=>{
    if(board && selectFrom==='Workspace'){
        fetchworkspaceMembers()
    }
  },[board,selectFrom])

  const fetchBoardMembers = async ()=>{
    try {
        const response = await api.get(`/board/${board._id}/members`);

        setBoardMembers([response.data.admin, ...response.data.members]);
    } catch (error) {
        console.log("Error in fetching board members - ",error)
    }
  }

  useEffect(()=>{
    if(board && board._id){
        fetchBoardMembers()
    }
  },[board]);

  // to search from all available users
  const searchGlobally = async (inputString) => {
    const value = inputString.trim();

    if(value===''){
        setSearchedUsers([])
        return null;
    }

    try {
        const response = await api.get(`/search/global-users?query=${value}`);

        setSearchedUsers(response.data.users);
    } catch (error) {
        console.log("Error in searching users - ",error)
        setErrorMsg("Something went wrong, try again.")
    }
  };

  const search = (e)=>{
    const value = e.target.value;
    setInputString(value);

    if(selectFrom === 'Workspace'){
        const filtered = workspaceMembers.filter(member =>
            member.firstName.toLowerCase().includes(value.toLowerCase())
        );

        setSearchedUsers(filtered);
    }
    else{
        searchGlobally(value);
    }
  }

  const checkIsAlreadyMember = (user)=>{
    return boardMembers.some(
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

  // directly add workspace members to board
  const addSelectedUsers = async (e)=>{
    e.preventDefault()
    if((selectedUsersIds.length===0 && selectedUsersInfo.length===0)) return;

    try {
        const response = await api.post(`/board/${board._id}/add-members`,
            {selectedUsers:selectedUsersIds}
        );

        console.log(response.data.message);
    } catch (error) {
        console.log("Error while adding new members - ",error)
    }
    finally{
        setSelectedUsersIds([])
        setSelectedUsersIds([])
        setIsAddingNewMembers(false)
    }
  }

  // send invite to selected users (select from all users available)
  const inviteSelectedUsers = async(e)=>{
    e.preventDefault()
    if((selectedUsersIds.length===0 && selectedUsersInfo.length===0)) return;

    console.log(user);
    try {
      socket.emit("send_board_invite", {
        boardId:board._id,
        userIds:selectedUsersIds,
        senderId:user._id,
      });

      socket.once("board_invite_sent", (data) => {
        console.log("invitation data : ", data);
      });
    } catch (error) {
      console.log("Error while sending invite - ",error)
    }
    finally{
      setSelectedUsersIds([])
      setSelectedUsersIds([])
      setIsAddingNewMembers(false)
    }
  }


  // reset all the data 
  useEffect(()=>{
    setInputString("");
    setErrorMsg("");
    setSearchedUsers([]);
    setSelectedUsersInfo([])
    setSelectedUsersIds([]);
  },[selectFrom])
  

  return (
    <div ref={divref} 
        className="w-80 sm:w-96 p-4 absolute top-10 -right-12 bg-white shadow-[0px_0px_10px_rgba(12,12,13,0.3)] rounded-xl border-[1px] border-gray-300 ">
      <div className="w-full h-auto" >
        <div className="w-full flex ">
            <div onClick={()=>{setSelectFrom("Workspace")}} 
                className={`cursor-pointer py-1 w-[50%] text-center ${(selectFrom==="Workspace")?`bg-gray-100 border-b-3 border-teal-500 text-gray-700`:
                `bg-transpersent text-gray-500`} font-semibold`}>
                Workspace
            </div>
            <div onClick={()=>{setSelectFrom("All")}} 
                className={`font-bold cursor-pointer py-1 w-[50%] text-center ${(selectFrom==="All")?`bg-gray-100 border-b-3 border-teal-500 text-gray-700 font-bold`:
                `bg-transpersent text-gray-500`} font-semibold`}>
                All
            </div>
        </div>
        <div className="w-full h-auto mt-4">
          {  (selectFrom==='Workspace') ?
            (<h3 className="text-gray-400 text-sm">
                Select and add members from workspace to this board.
            </h3>)
            :
            (<h3 className="text-gray-400 text-sm">
                Search and invite users to your board.
            </h3>)
          }
        </div>
        <form className="w-full h-auto">
          <div className="w-full mt-2">
            <input type="text" name="name" value={inputString} onChange={search} placeholder="Enter name"
              className="w-full py-2 px-2 text-base text-gray-700 rounded-md border-[1px] border-gray-300 outline-none"
            />
          </div>
          {(selectedUsersInfo.length!==0) &&
            <div className="mt-4 p-2 text-gray-500 border-[1px] border-teal-500 rounded-md flex gap-2 overflow-y-auto">
                {
                selectedUsersInfo.map((user)=>{
                    return <SelectedUserItem key={user._id} user={user} onRemove={removeSelectedUser} />
                })}
            </div>
          }         
          {
            (selectFrom==='Workspace' && searchedUsers.length ===0 && inputString==='')?
                (
                    <div className="flex flex-col p-2 mt-4 max-h-64 overflow-y-auto border-[1px] border-gray-300 rounded-lg ">
                        {
                        (workspaceMembers) &&
                            workspaceMembers.map((user)=>{
                                const isAlreadyMember = checkIsAlreadyMember(user);
                                return <UserItem key={user._id} user={user} isAlreadyMember={isAlreadyMember} selectingUsers={selectingUsers}
                                    checkIsAlreadySelected={checkIsAlreadySelected} />
                            })
                        }
                    </div>
                )
            :
            (searchedUsers.length!==0)?
                <div className="flex flex-col p-2 mt-4 max-h-64 overflow-y-auto border-[1px] border-gray-300 rounded-lg">
                    {
                    (searchedUsers && searchedUsers.length !== 0) &&
                    searchedUsers.map((user)=>{
                        const isAlreadyMember = checkIsAlreadyMember(user);
                        return <UserItem key={user._id} user={user} isAlreadyMember={isAlreadyMember} selectingUsers={selectingUsers}
                            checkIsAlreadySelected={checkIsAlreadySelected} />
                    })
                    }
                </div>
            : 
            (   (searchedUsers.length ===0 && inputString!=='') &&
                <div className="mt-4 p-2 text-gray-400 border-[1px] border-gray-300 rounded-lg">
                    Not found
                </div>
            )
          }
          {errorMsg.trim() !== "" && (
            <div className="flex flex-col mt-2 text-red-500">{errorMsg}</div>
          )}
          <div className="mt-4">
            {
            (selectFrom === "Workspace")?
                (<button onClick={addSelectedUsers}
                className={`w-full py-2 ${(selectedUsersIds.length!==0 && selectedUsersInfo.length!==0)?`bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl cursor-pointer`
                :`bg-teal-500 cursor-not-allowed`} 
                font-semibold text-white rounded-md outline-none border-none`}>
                Add members
                </button>)
            :
                (<button onClick={inviteSelectedUsers}
                className={`w-full py-2 ${(selectedUsersIds.length!==0 && selectedUsersInfo.length!==0)?`bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl cursor-pointer`
                :`bg-teal-500 cursor-not-allowed`} 
                font-semibold text-white rounded-md outline-none border-none`}>
                Send invite
                </button>)
            }
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberToBoard;


const UserItem = ({user,isAlreadyMember,selectingUsers,checkIsAlreadySelected})=>{
    const isAlreadySelected = checkIsAlreadySelected(user);
    return (
        <div onClick={()=>{selectingUsers(user)}} className={`w-full px-2 py-1 my-1 rounded-lg 
            ${(isAlreadyMember || isAlreadySelected)?`bg-gray-200 pointer-events-none cursor-not-allowed`:`hover:bg-gray-200 cursor-pointer`} flex items-center`}>
            <div className=" mr-3">
                <div className="w-7 h-7 rounded-full bg-blue-300 font-semibold text-base text-white flex justify-center items-center overflow-hidden">
                  {<img src={user.profileImage} alt="" />}
                </div>
            </div>
            <div className="w-full h-auto">
                <h2 className="font-semibold text-gray-700">{user.firstName} {user.lastName}</h2>
                { 
                (isAlreadyMember) &&
                <h2 className="text-gray-500 text-xs">Already a member.</h2>
                }
            </div>
        </div>
    )
}

const SelectedUserItem = ({user,onRemove})=>{
    return (
        <div className="px-1 py-[0.5px] border-[1px] border-gray-300 rounded-md text-gray-500 text-sm flex ">
            <h3 className="mr-1">{user.firstName} {user.lastName}</h3>
            <div onClick={()=>{onRemove(user)}} className="text-base px-1 flex items-center justify-center cursor-pointer "><RxCross2 /></div>
        </div>
    )
}
