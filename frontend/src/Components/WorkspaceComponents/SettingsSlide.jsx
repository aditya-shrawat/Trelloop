import React, { useEffect, useRef, useState } from 'react'
import { BiEdit } from "react-icons/bi";
import { RiLock2Line } from "react-icons/ri";
import { MdPublic } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../../api/useApi';

const initialWorkspacedata ={
    name:"",
    description:""
}

const SettingsSlide = ({isAdmin,isMember,workspace,setWorkspace}) => {
    const [editWorkspace,setEditWorkspace]  = useState(false)
    const [workspaceData,setWorkspaceData] = useState(initialWorkspacedata); // stores new input data
    const [errorMsg,setErrorMsg] = useState("")
    const [deleteWorkspace,setDeleteWorkspace] = useState(false)
    const [changingVisibility,setChangingVisibility] = useState(false);
    const api = useApi();


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
            const response = await api.patch(`/workspace/update/${workspace._id}`,
                {newName:workspaceData.name, newDescription:workspaceData.description}
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
                            <p className='text-gray-500 '>{workspace.name}</p>
                          :
                            <input value={workspaceData.name} onChange={handleInput} name='name'
                                type="text" placeholder="Enter workspace name"
                                className="p-2 mt-2 w-full lg:w-[70%] border-2 text-gray-700 border-teal-500 rounded-md outline-none"
                            />
                        }
                    </div>
                    <div className="w-full mt-6 flex flex-col  ">
                        <label className="text-gray-700 font-semibold">Description</label>
                        {
                          (!editWorkspace)?
                            ((workspace && workspace.description.trim()!=='')?
                            <p className='text-gray-500 '>{workspace.description}</p>:
                            <p onClick={()=>{setEditWorkspace(true)}} className='p-2 mt-2 w-full lg:w-[70%] outline-none border-[1px] border-gray-200 rounded-md text-gray-400 cursor-text'>
                                Enter workspace description...
                            </p>
                          )
                          :
                            <textarea value={workspaceData.description} onChange={handleInput} name='description'
                                placeholder="Enter workspace description"
                                className="p-2 mt-2 w-full lg:w-[70%] border-2 text-gray-700 border-teal-500 rounded-md outline-none"
                            />
                        }
                    </div>
                    { (errorMsg.trim()!=='') &&
                        <div className='text-red-600 text-sm mt-2'>
                            {errorMsg}
                        </div>
                    }
                    {(isAdmin || isMember) && (
                      (!editWorkspace)?
                        (<div className="w-full mt-8 flex ">
                            <div onClick={()=>{setEditWorkspace(true)}} className="primary-button px-4 py-1 flex justify-center items-center">
                                <BiEdit className='mr-2 text-lg' />Edit workspace
                            </div>
                        </div>)
                      :
                        (<div className="w-full mt-8 flex ">
                            <div>
                                <button onClick={closeEditing} className="outline-button px-6 py-1">
                                Cancel
                                </button>
                            </div>
                            <div>
                                <button onClick={updateWorkspace} className="primary-button px-6 py-1 ml-6">
                                Update
                                </button>
                            </div>
                        </div>)
                    )}

                    <div className='w-full mt-6 '>
                        <div className='w-full py-2 border-b-[1px] border-gray-300'>
                            <h1 className='text-gray-700 font-semibold'>Workspace visibility</h1>
                        </div>
                        <div className='w-full mt-6 flex flex-col md:flex-row md:items-center '>
                            {
                            (workspace.isPrivate) ?
                            (<div className='w-full '>
                                <div className='text-gray-700 font-semibold flex items-center'>
                                    <RiLock2Line className='mr-2' />Private
                                </div>
                                <p className='text-gray-500 text-sm mt-1'>
                                    Private workspace is only accessible by workspace members.
                                </p>
                            </div>)
                            :
                            (<div className='w-full '>
                                <div className='text-gray-700 font-semibold flex items-center'>
                                    <MdPublic className='mr-2' />Public
                                </div>
                                <p className='text-gray-500 text-sm mt-1'>
                                Anyone on the internet can see this workspace. Only workspace members can edit.
                                </p>
                            </div>)
                            }
                            { (isAdmin) &&
                            <div className='w-fit h-auto relative inline-block '>
                                <div onClick={()=>{setChangingVisibility(true)}} className='outline-button px-4 py-1 mt-4 md:ml-4'>
                                    Change
                                </div>
                                {
                                (changingVisibility)&&
                                <ChangeVisibilityComponent workspace={workspace} setWorkspace={setWorkspace} setChangingVisibility={setChangingVisibility} />
                                }
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
    
            {(isAdmin) &&
                <div className="mt-5 relative inline-block">
                    <div onClick={()=>{setDeleteWorkspace(true)}} className=" inline-block px-3 py-2 border-[1px] border-red-500 text-red-500 cursor-pointer hover:border-2 rounded-md">
                        Delete this Workspace ?
                    </div>
                    {
                    (deleteWorkspace)&&
                    <DeleteComponent workspaceId={workspace._id} setDeleteWorkspace={setDeleteWorkspace} />
                    }
                </div>
            }
        </div>
    );
  };

export default SettingsSlide


const DeleteComponent = ({workspaceId,setDeleteWorkspace})=>{
    const divref = useRef();
    const [errorMsg,setErrorMsg] = useState("")
    const navigate = useNavigate()
    const api = useApi();


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
            const response = await api.delete(`/workspace/delete/${workspaceId}`);

            console.log("Workspace deleted successfully.")
            setDeleteWorkspace(false)
            navigate(-2)
        } catch (error) {
            console.log("Error while deleting workspace - ",error)
            setErrorMsg("Something went wrong!")
        }
    }


    return (
        <div ref={divref} className='bg-white h-fit w-72 md:w-96 px-4 py-6 rounded-lg border-[1px] border-gray-300 
                absolute bottom-[100%] left-0 shadow-[0px_0px_10px_rgba(12,12,13,0.2)] z-10'>
            <div className='w-full h-full  '>
                <div className='w-full text-start'>
                    <h1 className='text-lg font-semibold text-gray-700'>Delete Workspace</h1>
                    <p className='text-sm mt-1 text-gray-600'>This will permanently delete the workspace and all its data, including boards and members. This action cannot be undone.</p>
                </div>
                {   (errorMsg.trim()!=="") &&
                    <div className='text-red-600 text-sm mt-2'>
                    {errorMsg}
                    </div>
                }
                <div className='w-full flex justify-between md:justify-evenly items-center mt-6'>
                    <div onClick={()=>{setDeleteWorkspace(false)}} className='outline-button px-8 py-1'>
                        Cancel
                    </div>
                    <div onClick={deletingWorkspace} className='px-8 py-1 bg-red-600 rounded-md text-white font-semibold cursor-pointer '>
                        Delete
                    </div>
                </div>
            </div>
        </div>
    )
}


const ChangeVisibilityComponent = ({workspace,setWorkspace,setChangingVisibility})=>{
    const divref = useRef();
    const [errorMsg,setErrorMsg] = useState("")
    const api = useApi();

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            setChangingVisibility(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const changeWorkspaceVisibility = async (visibility)=>{
        if(visibility===workspace.isPrivate) return;

        try {
            const response = await api.patch(`/workspace/visibility/${workspace._id}`,{newVisibility:visibility});

            setWorkspace(response.data.workspace)
        } catch (error) {
            console.log("Error while changing workspace visibility - ",error)
            setErrorMsg("Something went wrong!")
        }
    }

    return (
        <div ref={divref} className='bg-white h-fit w-72 md:w-96 p-4 rounded-lg border-[1px] border-gray-300 
                absolute bottom-full left-0 md:-left-72 shadow-[0px_0px_10px_rgba(12,12,13,0.2)] z-10'>
            <div className='w-full h-full  '>
                <div className='w-full space-y-2 '>
                    <div onClick={()=>{changeWorkspaceVisibility(true)}} className={`w-full p-2 cursor-pointer hover:bg-gray-100 rounded-lg ${(workspace.isPrivate)?`border-2 border-teal-500`:`border-none`}`}>
                        <div className='text-gray-700 font-semibold flex items-center'>
                            <RiLock2Line className='mr-2' />Private
                        </div>
                        <p className='text-gray-500 text-sm mt-1'>
                            Private workspace is only accessible by workspace members.
                        </p>
                    </div>
                    <div onClick={()=>{changeWorkspaceVisibility(false)}} className={`w-full p-2 cursor-pointer hover:bg-gray-100 rounded-lg ${(!workspace.isPrivate)?`border-2 border-teal-500`:`border-none`}`}>
                        <div className='text-gray-700 font-semibold flex items-center'>
                            <MdPublic className='mr-2' />Public
                        </div>
                        <p className='text-gray-500 text-sm mt-1'>
                            Anyone on the internet can see this workspace. Only workspace members can edit.
                        </p>
                    </div>
                </div>
                {   (errorMsg.trim()!=="") &&
                    <div className='text-red-600 text-sm mt-2'>
                    {errorMsg}
                    </div>
                }
            </div>
        </div>
    )
}