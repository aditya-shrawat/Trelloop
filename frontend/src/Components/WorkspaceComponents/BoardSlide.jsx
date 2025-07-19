import React, { useEffect, useState } from 'react'
import CreateBoard from '../CreateBoard';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { TbStar } from "react-icons/tb";
import { TbStarFilled } from "react-icons/tb";

const BoardSlide = ({isAdmin,isMember}) => {
    const [creatingBoard,setCreatingBoard] = useState(false);
    const [boards,setBoards] = useState([]);
    const [loading,setLoading] = useState(true);
    const { id, name } = useParams();

    const fetchBoards =async ()=>{
      try {
        const BackendURL = import.meta.env.VITE_BackendURL;
        const response = await axios.get(`${BackendURL}/workspace/${id}/boards`,
          {withCredentials: true}
        );

        setBoards(response.data.boards)
      } catch (error) {
        console.log("Error while fetching boards - ",error)
      }
      finally{
        setLoading(false)
      }
    }

    useEffect(()=>{
      if(id){
        fetchBoards()
      }
    },[id,name])


  return (
    <div className="w-full h-auto ">
      <h2 className="text-xl font-semibold text-gray-700">Boards</h2>
      <div className="w-full h-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ">
        {(isAdmin || isMember)&&
        (<div onClick={()=>{setCreatingBoard(true)}}
          className="min-w-44 max-w-56 h-28 p-3 rounded-lg hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] 
                cursor-pointer relative bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex justify-center items-center border-[1px] border-gray-300 ">
          <h3 className="font-semibold ">Create board</h3>
        </div>)}
        {(loading)?
        <div>Loading...</div>
        :
        boards.map((board) => (
          <BoardCard key={board._id} board={board} />
        ))
        }
      </div>
      {
        (creatingBoard)&& <CreateBoard setCreatingBoard={setCreatingBoard} workspaceName={name} 
                            workspaceID={id} />
      }
    </div>
  );
};

const BoardCard = ({board})=>{
  const [starStatus,setStarStatus] = useState(false)


  const fetchStarStatus = async (e)=>{
    try {
      const BackendURL = import.meta.env.VITE_BackendURL;
      const response = await axios.get(`${BackendURL}/board/${board._id}/starred`,
        {withCredentials: true}
      );

      setStarStatus(response.data.starStatus)
    } catch (error) {
      console.log("Error while fetching star status - ",error)
    }
  }

  useEffect(()=>{
    fetchStarStatus()
  },[])

  const toggleStarStatus = async (e)=>{
    e.preventDefault();

    try {
      const BackendURL = import.meta.env.VITE_BackendURL;
      const response = await axios.post(`${BackendURL}/board/${board._id}/starred`,
        {},
        {withCredentials: true}
      );

      setStarStatus(response.data.starStatus)
    } catch (error) {
      console.log("Error while toggling star status - ",error)
    }
  }


  return (
    <Link to={`/board/${board.name.replace(/\s+/g, '')}/${board._id}`} key={board._id} style={{background:board.background}}
        className="min-w-44 max-w-56 h-28 p-3 rounded-lg hover:shadow-[0px_4px_8px_rgba(12,12,13,0.3)] cursor-pointer relative ">
      <h3 className="font-bold text-white">{board.name}</h3>
      <div onClick={toggleStarStatus} 
          className="inline-block text-xl absolute bottom-3 right-3 ">
        {
        (!starStatus)?
        <div className='text-white hover:scale-115 hover:text-[#ffc300]'>
          <TbStar />
        </div>
        :
        <div className='hover:scale-115 text-[#ffc300]'>
          <TbStarFilled />
        </div>
        }
      </div>
    </Link>
  )
}

export default BoardSlide