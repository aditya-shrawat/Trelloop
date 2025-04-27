import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Card from "./Card";

const List = ({list}) => {
    const [cards,setCards] = useState([]);
    const [loading,setLoading] = useState(true);


    const fetchListCards = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/list/${list._id}/cards`,
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
    <div key={list._id} className="w-64 py-3 px-3 mr-4 border-[1px] border-gray-300 rounded-xl shadow-[0px_2px_4px_rgba(12,12,13,0.2)] ">
      <div className="w-full px-2 py-2  break-words font-semibold">
        {list.name}
      </div>
      <div className="w-full h-auto">
        {
            (loading)?
            <div>Loading cards ...</div>
            :
            <div className="w-full h-auto ">
                {
                cards.map((card)=>(
                    <Card key={card._id} card={card} />
                ))
                }
            </div>
        }
        <AddNewCard listId={list._id} setCards={setCards} />
      </div>
    </div>
  );
};

export default List;


const AddNewCard = ({listId,setCards})=>{
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
            const response = await axios.post(`${BackendURL}/list/${listId}/newCard`,
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
                className='w-full px-1 py-2 hover:bg-gray-200 cursor-pointer rounded-xl flex items-center 
                font-semibold text-gray-600'>
                <IoMdAdd className='mr-2 text-xl' /> Add new Card
            </div>
            :
            <div className='w-full h-auto px-2 py-3'>
                <input type="text" placeholder='Enter a title' onChange={handleInput} value={cardName}
                    className='w-full px-2 py-1 rounded-lg border-[1px] border-gray-300 outline-none ' 
                />
                {
                (errMsg.trim()!=="") &&
                <div className='text-red-500 text-[14px] mt-1'>{errMsg}</div>
                }
                <div className='w-full flex justify-evenly mt-3'>
                    <div onClick={createCard} className='font-semibold text-white text-[14px] bg-[#49C5C5] px-2 py-1 cursor-pointer rounded-lg '>
                        Add card
                    </div>
                    <div onClick={()=>{setCreatingNewCard(false)}} 
                        className='border-[1px] border-gray-300 px-2 py-1 cursor-pointer  text-[14px]
                         text-gray-600 font-semibold rounded-lg '>
                        Cancel
                    </div>
                </div>
            </div>
            }
        </div>
    </div>
    )
}
