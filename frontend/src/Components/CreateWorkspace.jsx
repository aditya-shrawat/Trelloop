import React, { useEffect, useRef, useState } from 'react'
import { useApi } from '../../api/useApi';


const initialWorkspaceData ={
  name:"",
  description:"",
};

const CreateWorkspace = ({setCreatingworkspace}) => {
  const divref = useRef(null);
  const [workspaceData,setWorkspaceData] = useState(initialWorkspaceData) ;
  const [errorMsg,setErrorMsg] = useState('');
  const [isCreating,setIsCreating] = useState(false)
  const api = useApi();

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

    if(isCreating) return;
    if(workspaceData.name.trim()===''){
      setErrorMsg("Workspace name is required.");
      return ;
    }

    setIsCreating(true)

    try {
      const response = await api.post('/workspace/new',
        {name:workspaceData.name,description:workspaceData.description});
      console.log("Workspace created!!")
      setCreatingworkspace(false)
    } catch (error) {
      console.log("Error while creating workspace - ",error)
    }
    finally{
      setIsCreating(false)
    }
  }

  return (
    <div className="w-screen h-screen overflow-x-hidden z-40 fixed top-0 left-0 bg-[rgba(0,0,0,0.75)] ">
        <div ref={divref} className=" max-w-[95%] sm:max-w-md md:max-w-lg w-full 
            absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-4 sm:px-6 py-6 sm:py-8 bg-white rounded-lg border-[1px] border-gray-300 ">
            <div className='w-full h-auto'>
                <h1 className='text-xl font-semibold text-gray-700 '>Create Your Workspace</h1>
                <h3 className='text-gray-400 mt-1 text-sm'>Centralize your tasks, teams, and tools — everything you need to stay organized and efficient in one smart space.</h3>
            </div>
            <form onSubmit={createWorkspace}
              className='w-full h-auto'>
              <div className='flex flex-col my-6'>
                <label className='mb-1 font-semibold text-gray-700' >Workspace name</label>
                <input type="text" name='name' value={workspaceData.name} onChange={handleInputChange}
                className='py-2 px-2 text-base text-gray-700 rounded-md border-[1px] border-gray-300 outline-none' />
              </div>
              <div className='flex flex-col'>
                <label className='mb-1 font-semibold text-gray-700' >Workspace description</label>
                <input type="text" name='description' value={workspaceData.description} onChange={handleInputChange}
                className='py-2 px-2 text-base text-gray-700 rounded-md border-[1px] border-gray-300 outline-none' />
              </div>
              { (errorMsg.trim()!=='') &&
                <div className='flex flex-col mt-2 text-red-500 text-sm'>
                  {errorMsg}
                </div>
              }
              <div className='mt-8'>
                <button type="submit"
                className='primary-button w-full py-2'>
                  {(isCreating)?"Creating...":"Create workspace"}
                </button>
              </div>
            </form>
        </div>
    </div>
  )
}

export default CreateWorkspace

