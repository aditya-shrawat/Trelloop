import axios from "axios";
import React, { useEffect, useRef, useState } from "react";


const colorOptions = ['#2980b9',  '#cd5a91', '#1abc9c', '#8e44ad', 'linear-gradient(to top, lightgrey 0%, lightgrey 1%, #e0e0e0 26%, #efefef 48%, #d9d9d9 75%, #bcbcbc 100%)', 
  'linear-gradient(-60deg, #ff5858 0%, #f09819 100%)', 'linear-gradient(to top, #09203f 0%, #537895 100%)', 'linear-gradient( 359.5deg,  rgba(115,122,205,1) 8.8%, rgba(186,191,248,1) 77.4% )', 
   'linear-gradient(60deg, #29323c 0%, #485563 100%)', 'linear-gradient( 179.1deg,  rgba(0,98,133,1) -1.9%, rgba(0,165,198,1) 91.8% )'];

const CreateBoard = ({ setCreatingBoard, workspaceName, workspaceID }) => {
  const divref = useRef(null);
  const [boardName,setBoardName] = useState('');
  const [workspaces,setWorkspaces] = useState([]);
  const [loading,setLoading] = useState(true);
  const [workspaceId,setWorkspaceId] = useState(null)
  const [errorMsg,setErrorMsg] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [isCreating,setIsCreating] = useState(false);

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
    if(isCreating) return;

    if(boardName.trim()===""){
      setErrorMsg("Board name is required!");
      return ;
    }
    if(!workspaceId) {
      setErrorMsg("Select a workspace.");
      return ;
    }

    setIsCreating(true);

    try {
      const BackendURL = import.meta.env.VITE_BackendURL;
      const response = await axios.post(`${BackendURL}/workspace/${workspaceId}/newBoard`,
        {boardName,workspaceId,background:selectedColor},
        {withCredentials: true}
      );

      console.log(response.data.message);
      setCreatingBoard(false)
    } catch (error) {
      console.log("Error while creating board - ",error)
    }
    finally{
      setIsCreating(false)
    }
  }

  const handleInput = (e)=>{
    e.preventDefault();
    setBoardName(e.target.value) ;
  }

  const handleColorChange = async (color) => {
    setSelectedColor(color)
  };

  return (
    <div className="w-screen h-screen overflow-x-hidden z-40 fixed top-0 left-0 bg-[rgba(0,0,0,0.75)] ">
      <div
        ref={divref}
        className=" max-w-[95%] sm:max-w-md md:max-w-lg w-full 
              bg-white  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-4 sm:px-6 py-6 sm:py-8 rounded-lg"
      >
        <div className="w-full h-auto">
          <h1 className="text-xl font-semibold text-gray-700 ">Create Board</h1>
          <h3 className="text-gray-400 text-sm">
          Boards help you divide tasks, track progress, and keep your team aligned.
          </h3>
        </div>

        <div className="w-full mt-6">
          <h3 className="mb-2 text-sm font-semibold text-gray-500">Background</h3>
          <div className='w-full grid grid-cols-4 sm:grid-cols-5 gap-3'>
            {colorOptions.map((color) => (
              <div key={color} onClick={() => handleColorChange(color)} style={{ background: color }}
                className={`max-w-24 w-full h-12 rounded-sm cursor-pointer ${selectedColor === color ? 'border-3 border-gray-700' : 'border-[1px] border-gray-300'}`}>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col mt-6">
          <label className="mb-1 text-sm font-semibold text-gray-500">Board title</label>
          <input
            type="text" name="boardName" value={boardName} onChange={handleInput}
            className="py-1 px-2 text-gray-700 rounded-md border-[1px] border-gray-300 outline-none"
          />
        </div>
        <div className="flex flex-col mt-6">
          <label className="mb-1 text-sm font-semibold text-gray-500">Workspace</label>
          { (loading)?
            <div className="mb-2 h-8 py-1 px-2 text-lg rounded-md border-[1px] border-gray-300 outline-none">
              Loading...
            </div> 
            :
            (workspaceName)?
            <div className="mb-1 h-8 py-1 px-2 text-gray-700 rounded-lg border-[1px] border-gray-300 outline-none">
              {workspaceName}
            </div> 
            :
            <select name="workspaceName" 
            onChange={(e) => setWorkspaceId(e.target.value)}
              className="mb-1 h-8 py-1 px-2 text-gray-700 rounded-md border-[1px] border-gray-300 outline-none" >
              {workspaces.map((workspace)=>(
                <option key={workspace._id} value={workspace._id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          }
        </div>
        { (errorMsg!=="") &&
          <div className="text-red-500 text-sm">
            {errorMsg}
          </div>
        }
        <div onClick={createBoard}
          className="mt-6">
          <button className="primary-button w-full py-2 font-semibold">
            {(isCreating)?"Creating...":"Create board"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoard;
