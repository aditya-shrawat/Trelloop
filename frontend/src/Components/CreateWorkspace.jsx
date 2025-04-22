import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'


const initialWorkspaceData ={
  name:"",
  description:"",
};

const CreateWorkspace = ({setCreatingworkspace}) => {
  const divref = useRef(null);
  const [workspaceData,setWorkspaceData] = useState(initialWorkspaceData) ;
  const [errorMsg,setErrorMsg] = useState('');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (divref.current && !divref.current.contains(e.target)) {
        setCreatingworkspace(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleInputChange = (e)=>{
    setWorkspaceData({...workspaceData,[e.target.name]:e.target.value});
  }

  const createWorkspace = async (e)=>{
    e.preventDefault()
    if(workspaceData.name.trim()===''){
      setErrorMsg("Workspace name is required.");
      return ;
    }

    try {
      const BackendURL = import.meta.env.VITE_BackendURL;
      const response = await axios.post(`${BackendURL}/workspace/new`,
        {name:workspaceData.name,description:workspaceData.description},
        {withCredentials: true}
      );
      // console.log(response.data.message);
      console.log("Workspace created!!")
      setCreatingworkspace(false)
    } catch (error) {
      console.log("Error while creating workspace - ",error)
    }
  }

  return (
    <div className="w-screen h-screen overflow-x-hidden z-20 fixed top-0 left-0 bg-[rgba(0,0,0,0.75)] ">
        <div ref={divref} className=" max-w-[95%] sm:max-w-md md:max-w-lg w-full 
            absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-8 py-12 bg-white rounded-xl border-[1px] border-gray-300 ">
            <div className='w-full h-auto'>
                <h1 className='text-xl font-semibold  '>Create Your Workspace</h1>
                <h3 className=' text-gray-500 mt-2 '>Centralize your tasks, teams, and tools — everything you need to stay organized and efficient in one smart space.</h3>
            </div>
            <form onSubmit={createWorkspace}
              className='w-full h-auto'>
              <div className='flex flex-col mt-8 mb-8'>
                <label className='mb-1 font-semibold ' >Workspace name</label>
                <input type="text" name='name' value={workspaceData.name} onChange={handleInputChange}
                className=' h-10 py-2 px-2 text-base rounded-lg border-[1px] border-gray-300 outline-none' />
              </div>
              <div className='flex flex-col'>
                <label className='mb-1 font-semibold ' >Workspace description</label>
                <input type="text" name='description' value={workspaceData.description} onChange={handleInputChange}
                className=' h-10 py-2 px-2 text-base rounded-lg border-[1px] border-gray-300 outline-none' />
              </div>
              { (errorMsg.trim()!=='') &&
                <div className='flex flex-col mt-2 text-red-500'>
                  {errorMsg}
                </div>
              }
              <div className='mt-10'>
                <button type="submit"
                className='bg-[#49C5C5] w-full py-2 font-semibold text-lg text-white rounded-xl 
                cursor-pointer outline-none border-none hover:bg-[#5fcaca] hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] '>
                  Create workspace
                </button>
              </div>
            </form>
        </div>
    </div>
  )
}

export default CreateWorkspace

