import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";


const colorOptions = ['#2980b9',  '#cd5a91', '#1abc9c', '#8e44ad', 'linear-gradient(to top, lightgrey 0%, lightgrey 1%, #e0e0e0 26%, #efefef 48%, #d9d9d9 75%, #bcbcbc 100%)', 
  'linear-gradient(-60deg, #ff5858 0%, #f09819 100%)', 'linear-gradient(to top, #09203f 0%, #537895 100%)', 'linear-gradient( 359.5deg,  rgba(115,122,205,1) 8.8%, rgba(186,191,248,1) 77.4% )', 
'linear-gradient(60deg, #29323c 0%, #485563 100%)', 'linear-gradient( 179.1deg,  rgba(0,98,133,1) -1.9%, rgba(0,165,198,1) 91.8% )'];

const ChangeBoardBg = ({boardId,currentBg,setBoardBg,setIsChangingBg}) => {
    const [selectedColor, setSelectedColor] = useState(currentBg);

    const handleColorChange = async (color) => {
        if(!color) return;
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.patch(`${BackendURL}/board/${boardId}/change-background`,
                {newBackground:color},
                {withCredentials: true}
            );

            console.log(response.data.message)
            setSelectedColor(color)
            setBoardBg(color)
        } catch (error) {
            console.log("error while changing board bg ",error)
        }
    };

    
  return (
    <div className='bg-white w-full p-4 h-auto rounded-lg overflow-hidden'>
        <div className='w-full h-auto max-h-[480px] overflow-y-auto overflow-x-hidden relative'>
            <div className='w-full text-start py-1 bg-white'>
                <h1 className='text-lg font-semibold text-gray-700 flex items-center'>
                    <span onClick={()=>setIsChangingBg(false)} className='cursor-pointer mr-1'><IoIosArrowBack /></span> 
                    Change background
                </h1>
                <h3 className='text-gray-400 text-sm px-1'>Choose a background to refresh your view.</h3>
            </div>
            <div className='w-full grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4'>
                {colorOptions.map((color) => (
                    <div key={color} onClick={() => handleColorChange(color)} style={{ background: color }}
                        className={`max-w-24 w-full h-12 rounded-sm cursor-pointer ${selectedColor === color ? 'border-3 border-gray-700' : 'border-[1px] border-gray-300'}`}>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default ChangeBoardBg