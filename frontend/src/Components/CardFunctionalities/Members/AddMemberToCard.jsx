import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'

const AddMemberToCard = ({onClose,cardId,cardMembers,boardId}) => {
    const divref = useRef();
    const [boardMembers,setBoardMembers] = useState([])
    const [errorMsg,setErrorMsg] = useState("")
    const [selectedMembersIds,setSelectedMembersIds] = useState([]);

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            onClose();
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchBoardMembers = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/board/${boardId}/members`,
            {withCredentials: true}
            );

            setBoardMembers([...response.data.members,response.data.admin])
        } catch (error) {
            console.log("Error while fetching baord members - ",error)
        }
    }

    useEffect(()=>{
        if(boardId) fetchBoardMembers()
    },[boardId])


    const checkIsAlreadyMember = (user)=>{
        return cardMembers.some(
            (member) => member._id === user._id
        );
    }

    const checkIsAlreadySelected = (user)=>{
        return selectedMembersIds.some(
            (u) => u === user._id
        );
    }

    const selectingMembers = (user)=>{
        const isAlreadyMember = checkIsAlreadyMember(user);
        const isAlreadySelected = checkIsAlreadySelected(user);

        if(isAlreadyMember) return;

        if(isAlreadySelected){
            setSelectedMembersIds((prev) =>
                prev.filter((id) => id !== user._id)
            );
        }
        else{
            setSelectedMembersIds((prev)=>[...prev,user._id]);
        }
    }

    const addNewMembers = async ()=>{
        if(selectedMembersIds.length ===0) return;
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.patch(`${BackendURL}/card/${cardId}/add-members`,
                {selectedMembersIds},
                {withCredentials: true}
            );

            console.log(response.data.message)
            // update card members , socket
            onClose()
        } catch (error) {
            console.log("Error while adding card members- ",error)
        }
    }

  return (
    <div ref={divref} className='bg-white h-fit w-72 sm:w-80 px-4 py-4 rounded-lg border-[1px] border-gray-300 
            absolute bottom-[130%] sm:top-[130%] sm:right-0 shadow-[0px_0px_12px_rgba(12,12,13,0.2)] z-10 '>
        <div className='w-full h-auto '>
            <div className='w-full h-auto' >
                <h3 className=' text-gray-700 font-semibold'>Add Members</h3>
                <h3 className='text-gray-400 text-sm'>Select board members to add to card.</h3>
            </div>
            <div className='mt-3 max-h-80 overflow-auto'>
                {
                    (boardMembers.length === 0)?
                    <div>No members</div> 
                    :
                    boardMembers?.map((user)=>{
                        const isAlreadyMember = checkIsAlreadyMember(user);
                        return <MemberItem key={user._id} user={user} isAlreadyMember={isAlreadyMember} selectingMembers={selectingMembers}
                            checkIsAlreadySelected={checkIsAlreadySelected} />
                    })
                }
            </div>
            {   (errorMsg.trim()!=="") &&
                <div className='text-red-600 text-sm mt-2'>
                {errorMsg}
                </div>
            }
            <div className='flex gap-4 mt-4'>
                <button onClick={onClose} className='outline-button flex-1 py-1'>
                    Cancel
                </button>
                <button onClick={addNewMembers} className='primary-button flex-1 py-1'>
                    Add
                </button>
            </div>
        </div>
    </div>
  )
}

export default AddMemberToCard


const MemberItem = ({user,isAlreadyMember,selectingMembers,checkIsAlreadySelected})=>{
    const isAlreadySelected = checkIsAlreadySelected(user);
    return (
        <div onClick={()=>{selectingMembers(user)}} className={`w-full p-2 my-1 rounded-lg 
            ${(isAlreadyMember || isAlreadySelected)?`bg-gray-200`:`hover:bg-gray-100`} cursor-pointer flex items-center`}>
            <div className=" mr-2">
                <div className="w-7 h-7 rounded-full bg-blue-300 font-semibold text-white flex justify-center items-center">
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