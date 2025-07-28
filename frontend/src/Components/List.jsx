import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Card from "./Card";
import { BsThreeDots } from "react-icons/bs";
import ListOptions from "./List Components/ListOptions";

const List = ({list,boardId,setLists,UserRole}) => {
    const [cards,setCards] = useState([]);
    const [loading,setLoading] = useState(true);
    const [showListOptions,setShowListOptions] = useState(false)

    const fetchListCards = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/board/${boardId}/list/${list._id}/cards`,
                {withCredentials: true}
            );

            setCards(response.data.cards)
        } catch (error) {
            console.log("Error while fetching cards  - ",error)
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchListCards()
    },[])


  return (
    <div className="w-[270px] shrink-0 h-full mr-4">

    <div className="max-h-full h-auto py-2 flex flex-col bg-white rounded-xl shadow-[0px_4px_8px_rgba(12,12,13,0.2)]">
      <div className="w-full px-3 pt-2 pb-1 text-gray-700 flex items-center justify-between">
        <div className="break-words font-semibold">
            {list.name}
        </div>
        { (UserRole.isBoardMember || UserRole.isWorkspaceMember || UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin) &&
            <div className="w-auto h-auto relative">
                <div onClick={()=>{setShowListOptions(true)}} className={`w-fit h-fit p-1 hover:bg-gray-200 ${(showListOptions)&&`bg-gray-200`} cursor-pointer rounded-md`}>
                    <BsThreeDots />
                </div>
                { showListOptions && <ListOptions list={list} setLists={setLists} boardId={boardId} UserRole={UserRole} setShowListOptions={setShowListOptions} />}
            </div>
        }
      </div>
      <div className="w-full flex-1 px-3 overflow-x-hidden overflow-y-auto space-y-2">
        {
            (loading)?
            <div>Loading cards ...</div>
            :
            <>
                {
                cards.map((card)=>(
                    <Card key={card._id} card={card} UserRole={UserRole} />
                ))
                }
            </>
        }
      </div>
      { (UserRole.isBoardMember || UserRole.isWorkspaceMember || UserRole.isBoardAdmin || UserRole.isWorkspaceAdmin) &&
        <div className="px-3 py-2">
            <AddNewCard listId={list._id} boardId={boardId} setCards={setCards} />
        </div>
      }
    </div>

    </div>
  );
};

export default List;


const AddNewCard = ({listId,boardId,setCards})=>{
    const [cardName,setCardName] = useState("");
    const [creatingNewCard,setCreatingNewCard] = useState(false)
    const divRef = useRef(null);
    const [errMsg,setErrMsg] = useState("");

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (divRef.current && !divRef.current.contains(e.target)) {
            setCreatingNewCard(false);
            setCardName("")
            setErrMsg("")
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleInput = (e)=>{
        e.preventDefault();
        setCardName(e.target.value)
    }

    const createCard = async (e)=>{
        e.preventDefault();

        if(cardName.trim()===""){
            setErrMsg("Card name is required.");
            return 
        }

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.post(`${BackendURL}/board/${boardId}/list/${listId}/newCard`,
                {cardName},
                {withCredentials: true}
            ); 

            setCards(prevLists => [...prevLists, response.data.card])
        } catch (error) {
            console.log("Error while creating card - ",error)
        }
        finally{
            setCreatingNewCard(false);
            setCardName("")
            setErrMsg("")
        }
    }


    return (
    <div ref={divRef} className={`w-full h-fit ${creatingNewCard &&`border-[2px] border-teal-500`} rounded-lg 
        cursor-pointer`}>
        <div className='w-full h-auto '>
            { (!creatingNewCard)?
            <div onClick={()=>setCreatingNewCard(true)} 
                className='w-full px-1 py-2 hover:bg-gray-100 cursor-pointer rounded-lg flex items-center 
                font-semibold text-gray-600 hover:text-gray-700'>
                <IoMdAdd className='mr-2 text-xl' /> Add new Card
            </div>
            :
            <div className='w-full h-auto px-2 py-3'>
                <input type="text" placeholder='Enter a title' onChange={handleInput} value={cardName}
                    className='w-full px-2 py-1 rounded-md border-[1px] text-gray-700 border-gray-300 outline-none ' 
                />
                {
                (errMsg.trim()!=="") &&
                <div className='text-red-500 text-[14px] mt-1'>{errMsg}</div>
                }
                <div className='w-full flex justify-between mt-3 gap-4'>
                    <button onClick={()=>{setCreatingNewCard(false)}} 
                        className='outline-button flex-1 py-1 text-sm'>
                        Cancel
                    </button>
                    <button onClick={createCard} className='primary-button flex-1 text-sm py-1'>
                        Add card
                    </button>
                </div>
            </div>
            }
        </div>
    </div>
    )
}
