import React, { useEffect, useRef, useState } from 'react'
import { BiEdit } from "react-icons/bi";
import { RiLock2Line } from "react-icons/ri";
import { MdPublic } from "react-icons/md";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const initialWorkspacedata ={
    name:"",
    description:""
}

const SettingsSlide = ({workspace,setWorkspace}) => {
    const [editWorkspace,setEditWorkspace]  = useState(false)
    const [workspaceData,setWorkspaceData] = useState(initialWorkspacedata);
    const [errorMsg,setErrorMsg] = useState("")
    const [deleteWorkspace,setDeleteWorkspace] = useState(false)


    useEffect(()=>{
        setWorkspaceData({name:workspace.name,description:workspace.description})
    },[])

    const handleInput = (e)=>{
        e.preventDefault()

        setWorkspaceData((prev)=>({...prev,[e.target.name]:e.target.value}))
    }

    const closeEditing = ()=>{
        setWorkspaceData({name:workspace.name,description:workspace.description})
        setErrorMsg("")
        setEditWorkspace(false)
    }

    const updateWorkspace = async (e)=>{
        e.preventDefault();

        if(workspaceData.name.trim()===''){
            setErrorMsg("Workspace name is required.")
            return ;
        }

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.patch(`${BackendURL}/workspace/update/${workspace._id}`,
                {newName:workspaceData.name, newDescription:workspaceData.description},
                {withCredentials: true}
            ); 

            setWorkspace(response.data.workspace)
            setEditWorkspace(false)
            setErrorMsg("")
        } catch (error) {
            console.log("Error while updating workspace - ",error)
        }
    }

    return (
        <div className="w-full h-auto ">
            <h2 className="text-xl font-semibold text-gray-700">Workspace settings</h2>
            <div className="w-full pb-10 h-auto mt-6">
                <div className="w-full  border-gray-300 ">
                    <div className="w-full flex flex-col ">
                        <label className="text-gray-700 font-semibold ">Name</label>
                        {
                          (!editWorkspace)?
                            <p className=' mt-2 text-gray-500 '>{workspace.name}</p>
                          :
                            <input value={workspaceData.name} onChange={handleInput} name='name'
                                type="text" placeholder="Enter workspace name"
                                className="p-2 mt-2 w-[50%] border-2 text-gray-700 border-[#49C5C5] rounded-lg outline-none"
                            />
                        }
                    </div>
                    <div className="w-full mt-6 flex flex-col  ">
                        <label className="text-gray-700 font-semibold">Description</label>
                        {
                          (!editWorkspace)?
                            <p className=' mt-2 text-gray-500 '>{workspace.description}</p>
                          :
                            <textarea value={workspaceData.description} onChange={handleInput} name='description'
                                placeholder="Enter workspace description"
                                className="p-2 mt-2 w-[50%] border-2 text-gray-700 border-[#49C5C5] rounded-lg outline-none"
                            />
                        }
                    </div>
                    { (errorMsg.trim()!=='') &&
                        <div className='text-red-600 text-sm mt-2'>
                            {errorMsg}
                        </div>
                    }
                    {
                      (!editWorkspace)?
                        <div className="w-full mt-8 flex ">
                            <div onClick={()=>{setEditWorkspace(true)}} className="px-4 py-1 cursor-pointer bg-[#49C5C5] hover:bg-[#5fcaca] hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] font-semibold text-white rounded-lg flex justify-center items-center">
                                <BiEdit className='mr-2 text-lg' />Edit workspace
                            </div>
                        </div>
                      :
                        <div className="w-full mt-8 flex ">
                            <div>
                                <button onClick={updateWorkspace} className="px-6 py-1 cursor-pointer bg-[#49C5C5] hover:bg-[#5fcaca] hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] font-semibold text-white rounded-lg">
                                Update
                                </button>
                            </div>
                            <div className="ml-10">
                                <button onClick={closeEditing} className="px-6 py-1 cursor-pointer border-[1px] text-gray-700 border-gray-300 hover:bg-gray-100 font-semibold rounded-lg">
                                Cancel
                                </button>
                            </div>
                        </div>
                    }

                    <div className='w-full mt-6 '>
                        <div className='w-full py-2 border-b-[1px] border-gray-300'>
                            <h1 className='text-gray-700 font-semibold'>Workspace visibility</h1>
                        </div>
                        <div className='w-full mt-6 flex items-center '>
                            {/* <div className='w-full '>
                                <div className='text-gray-700 font-semibold flex items-center'>
                                    <RiLock2Line className='mr-2' />Private
                                </div>
                                <p className='text-gray-500 text-sm mt-1'>
                                    This workspace is private workspace and only members will be able to see and access this workspace.
                                </p>
                            </div> */}
                            <div className='w-full '>
                                <div className='text-gray-700 font-semibold flex items-center'>
                                    <MdPublic className='mr-2' />Public
                                </div>
                                <p className='text-gray-500 text-sm mt-1'>
                                This is a public workspace and anyone with the link can view it.
                                </p>
                            </div>
                            <div className='w-fit h-auto '>
                                <div className='px-4 py-1 ml-6 border-[1px] border-gray-300 cursor-pointer 
                                    text-gray-700 font-semibold bg-gray-50 rounded-lg hover:bg-gray-100 '>
                                    Change
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <div className="mt-10 relative inline-block">
                <div onClick={()=>{setDeleteWorkspace(true)}} className=" inline-block px-3 py-2 border-[1px] border-red-500 text-red-500 cursor-pointer hover:font-semibold rounded-lg">
                    Delete this Workspace ?
                </div>
                {
                  (deleteWorkspace)&&
                  <DeleteComponent workspaceId={workspace._id} setDeleteWorkspace={setDeleteWorkspace} />
                }
            </div>
        </div>
    );
  };

export default SettingsSlide


const DeleteComponent = ({workspaceId,setDeleteWorkspace})=>{
    const divref = useRef();
    const [errorMsg,setErrorMsg] = useState("")
    const navigate = useNavigate()


    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            setDeleteWorkspace(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const deletingWorkspace = async (e)=>{
        e.preventDefault();

        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.delete(`${BackendURL}/workspace/delete/${workspaceId}`,
            {withCredentials: true}
            );

            console.log("Workspace deleted successfully.")
            setDeleteWorkspace(false)
            navigate(-2)
        } catch (error) {
            console.log("Error while deleting workspace - ",error)
            setErrorMsg("Something went wrong!")
        }
    }


    return (
        <div ref={divref} className='bg-white h-fit w-60 lg:w-80 px-4 py-6 rounded-lg border-[1px] border-gray-300 
                absolute bottom-[100%] left-0 shadow-[0px_0px_12px_rgba(12,12,13,0.3)] '>
            <div className='w-full h-full  '>
                <div className='w-full text-start'>
                    <h1 className='text-lg font-semibold text-gray-700'>Delete Workspace</h1>
                    <p className='text-sm mt-1 text-gray-600'>Add a link to any file, image, or document you want to attach to this card.</p>
                </div>
                {   (errorMsg.trim()!=="") &&
                    <div className='text-red-600 text-sm mt-2'>
                    {errorMsg}
                    </div>
                }
                <div className='w-full flex items-center mt-6'>
                    <div onClick={()=>{setDeleteWorkspace(false)}} className='px-4 py-0.5 rounded-lg text-gray-700 border-[1px] border-gray-300 cursor-pointer '>
                        Cancel
                    </div>
                    <div onClick={deletingWorkspace} className='px-4 py-0.5 ml-6 bg-red-600 rounded-lg text-white font-semibold cursor-pointer '>
                        Delete
                    </div>
                </div>
            </div>
        </div>
    )
}