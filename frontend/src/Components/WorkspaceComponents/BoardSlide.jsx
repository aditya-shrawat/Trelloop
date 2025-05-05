import React, { useEffect, useState } from 'react'
import CreateBoard from '../CreateBoard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TbStar } from "react-icons/tb";

const BoardSlide = ({workspace}) => {
    const [creatingBoard,setCreatingBoard] = useState(false);
    const [boards,setBoards] = useState([]);
    const [loading,setLoading] = useState(true);

    const fetchBoards =async ()=>{
      try {
        const BackendURL = import.meta.env.VITE_BackendURL;
        const response = await axios.get(`${BackendURL}/board/${workspace._id}/boards`,
          {withCredentials: true}
        );

        setBoards(response.data.boards)
      } catch (error) {
        console.log("Error while fetching blogs - ",error)
      }
      finally{
        setLoading(false)
      }
    }

    useEffect(()=>{
      if(workspace._id){
        fetchBoards()
      }
    },[workspace._id])


  return (
    <div className="w-full h-auto ">
      <h2 className="text-xl font-semibold text-gray-700">Boards</h2>
      <div className="w-full h-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ">
        <div onClick={()=>{setCreatingBoard(true)}}
          className="min-w-44 max-w-56 h-24 p-3 rounded-lg hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] 
                cursor-pointer relative bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex justify-center items-center border-[1px] border-gray-300 ">
          <h3 className="font-semibold ">Create board</h3>
        </div>
        {(loading)?
        <div>Loading...</div>
        :
        boards.map((board) => (
          <Link to={`/board/${board.name.replaceAll(" ","")}/${board._id}`} key={board._id}
            className="min-w-44 max-w-56 h-24 p-3 rounded-lg hover:shadow-[0px_4px_8px_rgba(12,12,13,0.3)] cursor-pointer relative bg-green-400 ">
            <h3 className="font-bold text-white">{board.name}</h3>
            <div className="inline-block text-xl text-white absolute bottom-3 right-3 hover:scale-115 hover:text-[#ffc300]">
              <TbStar />
            </div>
          </Link>
        ))
        }
      </div>
      {
        (creatingBoard)&& <CreateBoard setCreatingBoard={setCreatingBoard} workspaceName={workspace.name} 
                            workspaceID={workspace._id} />
      }
    </div>
  );
};

export default BoardSlide