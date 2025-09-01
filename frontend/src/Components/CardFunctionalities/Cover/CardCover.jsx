import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useApi } from '../../../../api/useApi';

const colorOptions = ['#9f8fef', '#ffa8d9', '#77b6fb', '#ffe566', '#32cd9e', '#fea362', '#b5f9a3', '#f87168', '#e2a0ff', '#adb5bd'];

const CardCover = ({onClose,cardId,setCardCover,currentColor}) => {
    const divref = useRef();
    const [selectedColor, setSelectedColor] = useState(currentColor);
    const api = useApi();

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            onClose();
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleColorChange = async (color) => {
        if(!color) return;
        try {
            const response = await api.patch(`/card/${cardId}/set-cover`,
                {newCover:color}
            );

            console.log(response.data.message)
            setCardCover(color);
            setSelectedColor(color)
        } catch (error) {
            console.error("Failed to update cover color", error);
        }
    };

    const removeCardCover = async ()=>{
        try {
            const response = await api.patch(`/card/${cardId}/remove-cover`,
                {}
            );

            console.log(response.data.message)
            setCardCover(null);
            setSelectedColor(null)
        } catch (error) {
            console.log("failed to remove card cover ",error)
        }
    }

  return (
    <div ref={divref} className='bg-white h-fit w-72 sm:w-80 px-4 py-4 rounded-lg border-[1px] border-gray-300 
            absolute bottom-[130%] left-0 shadow-[0px_0px_12px_rgba(12,12,13,0.2)] z-10 '>
        <div className='w-full'>
            <h3 className='pb-2 text-gray-700 font-semibold border-b-[1px] border-gray-300'>Card cover</h3>
            <h3 className='text-gray-500 text-xs my-3'>Select color to change card cover</h3>
            <div className='w-full grid grid-cols-5 gap-3'>
                {colorOptions.map((color) => (
                    <div key={color} onClick={() => handleColorChange(color)} style={{ backgroundColor: color }}
                        className={`max-w-12 w-full h-8 rounded-sm cursor-pointer border-3 ${selectedColor === color ? 'border-gray-600' : 'border-none'}`}>
                    </div>
                ))}
            </div>
            <div className='w-full mt-4 pt-4 border-t-[1px] border-gray-300'>
                <button onClick={removeCardCover} className='w-full py-1 cursor-pointer rounded-lg text-gray-700 font-semibold bg-gray-200 hover:bg-gray-300'>
                    Remove cover
                </button>
            </div>
        </div>
    </div>
  )
}

export default CardCover