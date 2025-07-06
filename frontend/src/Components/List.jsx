import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Card from "./Card";

const List = ({list,boardId,UserRole}) => {
    const [cards,setCards] = useState([]);
    const [loading,setLoading] = useState(true);


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

    <div className="max-h-full h-auto py-2 flex flex-col border-[1px] border-gray-300 rounded-xl shadow-[0px_2px_4px_rgba(12,12,13,0.2)] ">
      <div className="w-full px-3 pt-2 pb-1 break-words font-semibold text-gray-700">
        {list.name}
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
    <div ref={divRef} className={`w-full h-fit ${creatingNewCard &&`border-[2px] border-[#49C5C5]`} rounded-lg 
        cursor-pointer`}>
        <div className='w-full h-auto '>
            { (!creatingNewCard)?
            <div onClick={()=>setCreatingNewCard(true)} 
                className='w-full px-1 py-2 hover:bg-gray-100 cursor-pointer rounded-xl flex items-center 
                font-semibold text-gray-600 hover:text-gray-700'>
                <IoMdAdd className='mr-2 text-xl' /> Add new Card
            </div>
            :
            <div className='w-full h-auto px-2 py-3'>
                <input type="text" placeholder='Enter a title' onChange={handleInput} value={cardName}
                    className='w-full px-2 py-1 rounded-lg border-[1px] text-gray-700 border-gray-300 outline-none ' 
                />
                {
                (errMsg.trim()!=="") &&
                <div className='text-red-500 text-[14px] mt-1'>{errMsg}</div>
                }
                <div className='w-full flex justify-between mt-3'>
                    <button onClick={createCard} className='font-semibold text-white text-[14px] bg-[#49C5C5] w-[45%] py-1 outline-none cursor-pointer rounded-lg '>
                        Add card
                    </button>
                    <button onClick={()=>{setCreatingNewCard(false)}} 
                        className='border-[1px] border-gray-300 w-[45%] py-1 outline-none cursor-pointer  text-[14px]
                         text-gray-700 font-semibold rounded-lg hover:bg-gray-100'>
                        Cancel
                    </button>
                </div>
            </div>
            }
        </div>
    </div>
    )
}
