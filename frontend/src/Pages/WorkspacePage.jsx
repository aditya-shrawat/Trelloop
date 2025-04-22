import React from "react";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoPerson } from "react-icons/io5";
import { IoPersonAdd } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { TbStar } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const WorkspacePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const contentType = location.pathname.split("/").pop() ;
    const { id, name } = useParams();

    const handleNavigation = (type)=>{
        navigate(`/workspace/${id}/${name}/${type}`);
    }

    const isActive = (type) => contentType === type;


  return (
    <main className="w-full h-full overflow-hidden ">
        <div className="w-full h-full flex ">
            <div className="w-[20%] h-full border-r-[1px] border-gray-300 ">
                
                <div className="w-full h-auto p-2 border-b-[1px] border-gray-300 ">
                    <div className="w-full px-2 py-2 flex items-center ">
                        <div className="w-auto h-auto inline-block mr-4">
                            <span className="w-10 h-10 font-bold text-lg text-white bg-blue-300 rounded-md flex items-center justify-center ">
                            {/* {workspace.name[0].toUpperCase()} */}W
                            </span>
                        </div>
                        <div className="w-full font-semibold text-lg text-gray-500 flex items-center justify-between">
                            <div className=" line-clamp-1">workspace</div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-full px-2 mt-4 ">
                    <div onClick={()=>{handleNavigation('name')}} 
                        className={`my-2 px-2 py-1 flex items-center text-gray-500 hover:font-semibold hover:text-gray-600
                        hover:bg-gray-100 rounded-md cursor-pointer ${isActive("name")?"bg-gray-200 text-gray-600 font-semibold":""} `}>
                        <TbLayoutDashboardFilled className="mr-3 text-xl"/> Boards
                    </div>
                    <div onClick={()=>{handleNavigation('members')}}
                        className={`my-2 px-2 py-1 flex items-center text-gray-500 hover:font-semibold hover:text-gray-600
                        hover:bg-gray-100 rounded-md cursor-pointer ${isActive("members")?"bg-gray-200 text-gray-600 font-semibold":""} `}>
                        <IoPerson className="mr-3 text-xl"/> Members
                    </div>
                    <div className="my-2 px-2 py-1 flex items-center text-gray-500 hover:font-semibold hover:text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer ">
                        <IoPersonAdd className="mr-3 text-xl"/> Add member
                    </div>
                    <div onClick={()=>{handleNavigation('settings')}}
                        className={`my-2 px-2 py-1 flex items-center text-gray-500 hover:font-semibold hover:text-gray-600
                        hover:bg-gray-100 rounded-md cursor-pointer ${isActive("settings")?"bg-gray-200 text-gray-600 font-semibold":""} `}>
                        <IoMdSettings className="mr-3 text-xl"/> Settings
                    </div>
                </div>

            </div>
            <div className="h-full w-full px-6 py-2 ">
                <div className="w-full h-auto px-2 py-6 flex justify-center border-b-[1px] border-gray-300 ">
                    <div className="w-full max-w-[85%] flex justify-between items-center ">
                        <div className="w-auto px-2 py-2 flex items-center ">
                            <div className="w-auto h-auto inline-block mr-6">
                                <span className="w-14 h-14 font-bold text-2xl text-white bg-blue-300 rounded-md flex items-center justify-center ">
                                {/* {workspace.name[0].toUpperCase()} */}W
                                </span>
                            </div>
                            <div className="w-full text-xl ">
                                <div className="font-semibold line-clamp-1">workspace</div>
                                <div className=" text-[14px] text-gray-500">Description</div>
                            </div>
                        </div>
                        <div>
                            <button className="px-4 py-1 bg-[#49C5C5] hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] rounded-lg cursor-pointer
                             text-white font-semibold flex items-center">
                                <IoPersonAdd className="mr-3 text-lg"/> Invite workspace members
                            </button>
                        </div>
                    </div>
                </div>
                <div className="h-auto w-full px-2 pt-6 ">
                    {(contentType==='name') && <BoardSlide />}
                    {(contentType==='members') && <MembersSlide />}
                    {(contentType==='settings') && <SettingsSlide />}
                </div>
            </div>
        </div>
    </main>
  );
};



const BoardSlide = ()=>{
    return (
    <div className="w-full h-auto">
        <h2 className="text-xl font-semibold ">Boards</h2>
        <div className="w-full h-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ">
            <div className="min-w-44 max-w-56 h-24 p-3 rounded-lg hover:shadow-[0px_4px_8px_rgba(12,12,13,0.3)] 
                cursor-pointer relative bg-gray-100 hover:bg-gray-200 flex justify-center items-center ">
                <h3 className="font-semibold text-gray-500">Create board</h3>
            </div>
            {
                [...Array(16)].map((__dirname,index)=>(
                    <div key={index} className="min-w-44 max-w-56 h-24 p-3 rounded-lg hover:shadow-[0px_4px_8px_rgba(12,12,13,0.3)] cursor-pointer relative bg-green-400 ">
                        <h3 className="font-bold text-white">Board name</h3>
                        <div className="inline-block text-xl text-white absolute bottom-3 right-3 hover:scale-115 hover:text-[#ffc300]"><TbStar /></div>
                    </div>
                ))
            }
        </div>
    </div>
    )
}


const MembersSlide = ()=>{
    return (
    <div className="w-full h-auto">
        <div className="pb-6 border-b-[1px] border-gray-300 ">
            <h2 className="text-xl font-semibold ">{`Workspace members (6)`}</h2>
            <h2 className="text-base text-gray-500 mt-2">
                Workspace members can view and join all Workspace visible boards and create new boards in the Workspace.
            </h2>
        </div>
        <div className="mt-4 w-full h-auto ">
            {
            [...Array(6)].map((_,index)=>(
                <div key={index} className="w-full py-4 border-b-[1px] border-gray-300 flex items-center">
                    <div className=" mr-4">
                        <div className="w-10 h-10 rounded-full bg-blue-300 font-semibold text-base text-white flex justify-center items-center">
                            AS
                        </div>
                    </div>
                    <div className="w-full h-auto flex justify-between items-center">
                        <div className="w-full h-auto">
                            <h2 className="font-semibold">Aditya shrawat</h2>
                            <h2 className="text-gray-500 text-[14px]">@adityashrawat</h2>
                        </div>
                        <div className="w-auto h-auto inline-block ">
                            <div className="px-2 py-1 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200 
                                hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] text-gray-500 font-semibold flex items-center ">
                                <RxCross2 className="mr-2 text-xl" /> Remove
                            </div>
                        </div>
                    </div>
                </div>
            ))
            }
        </div>
    </div>
    )
}


const SettingsSlide = ()=>{
    return (
    <div className="w-full h-auto">
        <h2 className="text-xl font-semibold ">Workspace settings</h2>
        <div className="w-full pb-10 h-auto mt-6">
            <div className="w-[50%]  border-gray-300 " >
                <div className="w-full flex flex-col font-semibold ">
                    <label className="text-gray-600" >Name</label>
                    <input type="text" placeholder="Workspace name"
                    className="p-2 mt-2 border-[1px] border-gray-300 rounded-lg outline-none" />
                </div>
                <div className="w-full mt-6 flex flex-col font-semibold ">
                    <label className="text-gray-600" >Description</label>
                    <textarea placeholder="Workspace description"
                    className="p-2 mt-2 border-[1px] border-gray-300 rounded-lg outline-none" />
                </div>
                <div className="w-full mt-8 flex ">
                    <div>
                        <button className="px-6 py-1 cursor-pointer bg-[#49C5C5] font-semibold text-white rounded-lg">
                            Save
                        </button>
                    </div>
                    <div className="ml-10">
                        <button className="px-6 py-1 cursor-pointer border-[1px] border-gray-300 hover:bg-gray-100 font-semibold rounded-lg">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="pt-10 border-t-[1px] border-gray-300">
            <div className=" inline-block px-3 py-2 border-[1px] border-red-500 text-red-500 cursor-pointer hover:bg-gray-100 font-semibold rounded-lg">
                Delete this Workspace ? 
            </div>
        </div>

    </div>
    )
}


export default WorkspacePage;
