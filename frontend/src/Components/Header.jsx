import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { TbLayoutDashboardFilled } from "react-icons/tb";

const Header = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const [openProfileNav,setOpenProfileNav] = useState(false)

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpenDropdown(null);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  return (
    <header className="w-full h-auto ">
        <div className="w-full h-14 px-6 bg-white flex items-center justify-between border-b-[1px] border-gray-300 ">
            <div className="w-full h-full flex items-center ">
                <div className=" inline-block font-bold text-[#49C5C5] text-2xl mr-6">
                    Trelloop
                </div>
                <div className="w-full h-auto">
                    <div className="w-auto h-auto inline-block relative ">
                        <div onClick={()=>setOpenDropdown(openDropdown === "workspace" ? null : "workspace")}
                         className="px-2 py-1 text-gray-500 hover:text-gray-700 cursor-pointer rounded-lg 
                         flex items-center font-semibold">
                            Workspaces
                            <IoMdArrowDropdown className={`ml-1 text-2xl ${(openDropdown === "workspace")?
                                `rotate-180 transition-transform duration-300`:`rotate-0 transition-transform duration-300`} `} 
                            />
                        </div>

                        {openDropdown === "workspace" && (
                            <div ref={dropdownRef} className="absolute top-full left-0 mt-4 z-30 w-[300px]">
                            <WorkspaceDropDown />
                            </div>
                        )}
                    </div>
                    <div className="w-auto h-auto inline-block relative">
                        <div onClick={()=>setOpenDropdown(openDropdown === "starred" ? null : "starred")}
                            className="px-2 py-1 ml-3 text-gray-500 hover:text-gray-700 cursor-pointer rounded-lg 
                            flex items-center font-semibold">
                            Starred <IoMdArrowDropdown className={`ml-1 text-2xl ${(openDropdown === "starred")?
                                `rotate-180 transition-transform duration-300`:`rotate-0 transition-transform duration-300`} `}
                             />
                        </div>
                        
                        {openDropdown === "starred" && (
                            <div ref={dropdownRef} className="absolute top-full left-0 mt-4 z-30 w-[300px]">
                            <StarredDropDown />
                            </div>
                        )}
                    </div>
                    <div className="w-auto h-auto inline-block relative">
                        <div onClick={()=>setOpenDropdown(openDropdown === "create" ? null : "create")}
                            className="px-2 py-1 ml-3 text-white bg-[#49C5C5] hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] 
                            cursor-pointer rounded-lg flex items-center font-semibold">
                            Create <FaPlus className="ml-2 text-lg" />
                        </div>

                        {openDropdown === "create" && (
                            <div ref={dropdownRef} className="absolute top-full left-0 mt-4 z-30 w-[300px]">
                            <CreateDropDown />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-auto h-full flex items-center">
                <div className="w-auto h-auto text-2xl cursor-pointer text-gray-500 hover:text-gray-700">
                    <IoNotifications />
                </div>
                <div className="w-auto h-auto ml-4 relative">
                    <div onClick={()=>setOpenProfileNav(true)} className="h-8 w-8 flex items-center justify-center 
                    bg-blue-500 text-white font-semibold text-lg rounded-full cursor-pointer hover:shadow-[0px_4px_8px_rgba(12,12,13,0.3)]  ">
                    P
                    </div>

                    {
                    (openProfileNav) &&
                    <ProfilePicNavBar setOpenProfileNav={setOpenProfileNav} />
                    }
                </div>
            </div>
        </div>
    </header>
  );
};

const WorkspaceDropDown = () => {
  return (
    <div className=" max-w-[300px] w-full h-auto px-3 py-3 rounded-md bg-white
    shadow-[0px_0px_10px_rgba(12,12,13,0.2)] z-30 ">
      {
        [...Array(4)].map((_,index)=>(
            <div key={index} className="w-full px-2 py-1 my-2 hover:bg-gray-100 rounded-lg flex items-center cursor-pointer ">
                <div className="w-auto h-auto inline-block mr-4">
                <span className="w-8 h-8 font-bold text-white bg-blue-300 rounded-md flex items-center justify-center ">
                    W
                </span>
                </div>
                <div className="w-full font-semibold text-gray-500 ">
                Workspace 1
                </div>
            </div>
        ))
      }
    </div>
  );
};

const StarredDropDown = ()=>{
    return(
    <div className=" max-w-[300px] w-full h-auto px-3 py-3 rounded-md bg-white 
        shadow-[0px_0px_10px_rgba(12,12,13,0.2)] z-30 ">
        <div className="w-full h-full ">
            {
                [...Array(4)].map((_,index)=>(
                    <div key={index} className="w-full px-2 py-1 my-2 hover:bg-gray-100 rounded-lg flex items-center cursor-pointer ">
                        <div className="w-auto h-auto inline-block mr-4">
                        <span className="w-8 h-8 font-bold text-white bg-blue-300 rounded-md flex items-center justify-center ">
                            W
                        </span>
                        </div>
                        <div className="w-full text-gray-500 ">
                        <h1 className="font-semibold text-[14px]">Board name</h1>
                            <h3 className="text-[12px]  ">Workspace 1</h3>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
    )
}

const CreateDropDown = ()=>{
    return(
    <div className=" max-w-[300px] w-full h-auto px-3 py-3 rounded-md bg-white
        shadow-[0px_0px_10px_rgba(12,12,13,0.2)] z-30 ">
        <div className="w-full px-2 py-2 my-1 hover:bg-gray-100 rounded-lg cursor-pointer ">
            <h1 className="text-gray-500 font-semibold text-[14px] flex items-center "> 
                <TbLayoutDashboardFilled className="mr-2 text-base " />Create Board
            </h1>
            <h3 className="text-gray-500 text-[12px] ">A board is made up of cards ordered on lists. Use it to manage and organize projects.</h3>
        </div>
        <div className="w-full px-2 py-2 my-1 hover:bg-gray-100 rounded-lg cursor-pointer ">
            <h1 className="text-gray-500 font-semibold text-[14px] flex items-center ">
                <RxDashboard className="mr-2 text-base " />Create Workspace
            </h1>
            <h3 className="text-gray-500 text-[12px] ">A workspace contains multiple boards and brings your team or projects together in one place.</h3>
        </div>
    </div>
    )
}

const ProfilePicNavBar = ({setOpenProfileNav})=>{
    const navRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (navRef.current && !navRef.current.contains(e.target)) {
            setOpenProfileNav(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
    <div ref={navRef} className="w-[350px] h-auto bg-white shadow-[0px_0px_10px_rgba(12,12,13,0.3)] rounded-lg z-40 absolute top-12 right-0  ">
        <div className=" w-full h-full px-3 py-4 ">
            <div className="w-full h-auto pb-6 border-b-[1px] border-gray-300 px-2">
                <h2 className="font-semibold text-gray-500 ">Account</h2>
                <div className="w-full flex items-start mt-3">
                    <div className="w-auto h-auto mr-4">
                        <div className="h-9 w-9 flex items-center justify-center bg-blue-500 text-white font-semibold text-lg rounded-full ">
                        P
                        </div>
                    </div>
                    <div>
                        <h1 className="text-gray-500 font-semibold break-words">Name</h1>
                        <h2 className="text-gray-500 break-words text-[14px]">email@gmail.com</h2>
                    </div>
                </div>
            </div>
            <div className="w-full h-full mt-6 ">
                <div className="my-2 px-2 py-2 font-semibold text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer ">
                    Manage account
                </div>
                <div className="my-2 px-2 py-2 font-semibold text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer ">
                    Create Workspace
                </div>
                <div className="my-2 px-2 py-2 font-semibold text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer ">
                    Settings
                </div>
                <div className="mt-2 mb-4 px-2 py-2 font-semibold text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer ">
                    Theme
                </div>
                <div className="pt-2 border-t-[1px] border-gray-300">
                    <div className="my-2 px-2 py-2 font-semibold text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer ">
                        Logout
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Header;
