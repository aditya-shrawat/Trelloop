import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const CreateBoard = ({ setCreatingBoard, workspaceName, workspaceID }) => {
  const divref = useRef(null);
  const [boardName,setBoardName] = useState('');
  const [workspaces,setWorkspaces] = useState([]);
  const [loading,setLoading] = useState(true);
  const [workspaceId,setWorkspaceId] = useState(null)
  const [errorMsg,setErrorMsg] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (divref.current && !divref.current.contains(e.target)) {
        setCreatingBoard(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const fetchWorkspaces = async ()=>{
    try {
        const BackendURL = import.meta.env.VITE_BackendURL;
        const response = await axios.get(`${BackendURL}/workspace/`,
          {withCredentials: true}
        );
        
      setWorkspaces(response.data.workspaces);
      setWorkspaceId(response.data.workspaces[0]._id)
      setLoading(false)
    } catch (error) {
      console.log("Error while fetching workspaces - ",error)
    }
  }

  useEffect(()=>{
    if(!workspaceName){
      fetchWorkspaces()
    }
    else{
      setWorkspaceId(workspaceID);
      setLoading(false)
    }
  },[])


  const createBoard = async (e)=>{
    e.preventDefault();

    if(boardName.trim()===""){
      setErrorMsg("Board name is required!");
      return ;
    }

    try {
      const BackendURL = import.meta.env.VITE_BackendURL;
      const response = await axios.post(`${BackendURL}/board/new`,
        {boardName,workspaceId},
        {withCredentials: true}
      );

      console.log(response.data.message);
      setCreatingBoard(false)
    } catch (error) {
      console.log("Error while creating board - ",error)
    }
  }

  const handleInput = (e)=>{
    e.preventDefault();
    setBoardName(e.target.value) ;
  }

  return (
    <div className="w-screen h-screen overflow-x-hidden z-20 fixed top-0 left-0 bg-[rgba(0,0,0,0.75)] ">
      <div
        ref={divref}
        className=" max-w-[95%] sm:max-w-md md:max-w-lg w-full 
                absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-8 py-12 bg-white rounded-xl border-[1px] border-gray-300 "
      >
        <div className="w-full h-auto">
          <h1 className="text-xl font-semibold text-gray-700 ">Create Board</h1>
          <h3 className=" text-gray-500 mt-2 ">
          Boards help you divide tasks, track progress, and keep your team aligned.
          </h3>
        </div>
        <div className="flex flex-col mt-8">
          <label className="mb-1 font-semibold text-gray-700">Board name</label>
          <input
            type="text" name="boardName" value={boardName} onChange={handleInput}
            className="mb-4 h-10 p-1 px-2 text-base text-gray-700 rounded-lg border-[1px] border-gray-300 outline-none"
          />
        </div>
        <div className="flex flex-col mt-4">
          <label className="mb-1 font-semibold text-gray-700">Workspace</label>
          { (loading)?
            <div className="mb-4 h-10 p-1 px-2 text-lg rounded-lg border-[1px] border-gray-300 outline-none">
              Loading...
            </div> 
            :
            (workspaceName)?
            <div className="mb-4 h-10 p-1 px-2 text-base text-gray-700 rounded-lg border-[1px] border-gray-300 outline-none">
              {workspaceName}
            </div> 
            :
            <select name="workspaceName" 
            onChange={(e) => setWorkspaceId(e.target.value)}
              className="mb-4 h-10 p-1 px-2 text-base text-gray-700 rounded-lg border-[1px] border-gray-300 outline-none" >
              {workspaces.map((workspace)=>(
                <option key={workspace._id} value={workspace._id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          }
        </div>
        { (errorMsg!=="") &&
          <div className="text-red-500 ">
            {errorMsg}
          </div>
        }
        <div onClick={createBoard}
          className="mt-6">
          <button className="bg-[#49C5C5] hover:bg-[#5fcaca] hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] w-full py-2 font-semibold text-lg text-white rounded-xl 
          cursor-pointer outline-none border-none ">
            Create board
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoard;
