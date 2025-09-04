import React, { useEffect, useState } from 'react'
import CreateBoard from '../CreateBoard';
import { Link, useParams } from 'react-router-dom';
import { TbStar } from "react-icons/tb";
import { TbStarFilled } from "react-icons/tb";
import { useApi } from '../../../api/useApi';
import useWorkspaceSocket from '../../Socket/useWorkspaceSocket';
import socket from '../../Socket/socket';

const BoardSlide = ({isAdmin,isMember}) => {
    const [creatingBoard,setCreatingBoard] = useState(false);
    const [boards,setBoards] = useState([]);
    const [loading,setLoading] = useState(true);
    const { id, name } = useParams();
    const api = useApi();

    const fetchBoards =async ()=>{
      try {
        const response = await api.get(`/workspace/${id}/boards`);

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

    // join workspace room
    useWorkspaceSocket(socket,id);

    // socket handlers 
    useEffect(() => {
      if ((!isAdmin || !isMember) && !id) return;

      const handleBoardCreated = (data) => {
        if (data.workspaceId === id) {
          setBoards((prevBoards) => [...prevBoards, data.newBoard]);
        }
      };

      socket.on('workspace_board_created', handleBoardCreated);

      return () => {
        socket.off('workspace_board_created', handleBoardCreated);
      };
    }, [(isAdmin || isMember), id]);

  return (
    <div className="w-full h-auto ">
      <h2 className="text-xl font-semibold text-gray-700">Boards</h2>
      <div className="w-full h-auto mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {(isAdmin || isMember)&&
        (<div onClick={()=>{setCreatingBoard(true)}}
          className="flex-1 max-w-72 h-28 p-3 rounded-lg hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] 
                cursor-pointer relative bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex justify-center items-center border-[1px] border-gray-300 ">
          <h3 className="font-semibold inline-block text-center">Create board</h3>
        </div>)}
        {(loading)?
        <div>Loading...</div>
        :
        boards?.map((board) => (
          <BoardCard key={board._id} board={board} api={api}/>
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

const BoardCard = ({board,api})=>{
  const [starStatus,setStarStatus] = useState(false)


  const fetchStarStatus = async (e)=>{
    try {
      const response = await api.get(`/board/${board._id}/starred`);

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
      const response = await api.post(`/board/${board._id}/starred`,
        {},
      );

      setStarStatus(response.data.starStatus)
    } catch (error) {
      console.log("Error while toggling star status - ",error)
    }
  }


  return (
    <Link to={`/board/${board.name.replace(/\s+/g, '')}/${board._id}`} key={board._id} style={{background:board.background}}
        className="flex-1 max-w-72 h-28 p-3 rounded-lg hover:shadow-[0px_4px_8px_rgba(12,12,13,0.3)] cursor-pointer relative ">
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