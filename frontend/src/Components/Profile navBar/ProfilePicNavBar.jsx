import React, { useEffect, useRef, useState } from "react";
import CreateWorkspace from "../CreateWorkspace";
import { IoSettingsOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineLightMode } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../api/useApi";

const ProfilePicNavBar = ({ currentUser, setOpenProfileNav }) => {
  const navRef = useRef(null);
  const [creatingWorkspace, setCreatingworkspace] = useState(false);
  const [showSignOutPopUp,setShowSignOutPopUp] = useState(false);
  const { openUserProfile } = useClerk();

  const handleManageAccount = () => {
    openUserProfile();
  };

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
    <div
      ref={navRef}
      className="w-[90vw] h-[100vh] sm:w-[350px] sm:h-auto bg-white border-[1px] border-gray-300 shadow-[-2px_2px_10px_rgba(12,12,13,0.1)] rounded-lg z-40 absolute top-full -right-6"
    >
      <div className=" w-full h-full px-3 py-4 ">
        <div className="w-full h-auto pb-6 border-b-[1px] border-gray-300 px-2">
          <h2 className="font-semibold text-gray-700 ">Account</h2>
          <div className="w-full flex items-start mt-3">
            <div className="w-auto h-auto mr-4">
              <div className="h-9 w-9 mt-1 flex items-center justify-center bg-blue-500 text-white font-semibold text-lg rounded-full overflow-hidden">
                <img src={currentUser.profileImage} alt="" />
              </div>
            </div>
            <div>
              <h1 className="text-gray-700 font-semibold break-words line-clamp-2">
                {currentUser?.firstName} {currentUser?.lastName}
              </h1>
              <h2 className="text-gray-500 break-words text-sm line-clamp-2">
                @{currentUser?.username}
              </h2>
            </div>
          </div>
        </div>
        <div className="w-full h-full mt-2 space-y-2">
          <div onClick={handleManageAccount} className="px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
            <IoSettingsOutline className="mr-3" />
            Manage Account
          </div>
          <div
            onClick={() => {
              setCreatingworkspace(true);
            }}
            className="px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center"
          >
            <FaPlus className="mr-3" />
            Create Workspace
          </div>
          <div className="px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
            <MdOutlineLightMode className="mr-3" />
            Theme
          </div>
          <div className="pt-2 border-t-[1px] border-gray-300">
            {/* <div className="w-full relative"> */}
                
                {
                (showSignOutPopUp) ? 
                    <SignOutPopUp setShowSignOutPopUp={setShowSignOutPopUp}  />
                :
                    <div
                        onClick={()=>{setShowSignOutPopUp(true)}}
                        className="mt-2 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center"
                    >
                        <FiLogOut className="mr-3" />
                        SignOut
                    </div>
                }
            {/* </div> */}
          </div>
        </div>
      </div>

      {creatingWorkspace && (
        <CreateWorkspace setCreatingworkspace={setCreatingworkspace} />
      )}
    </div>
  );
};

export default ProfilePicNavBar;



const SignOutPopUp = ({setShowSignOutPopUp})=>{
    const divref = useRef();
    const [errorMsg,setErrorMsg] = useState("")
    const { signOut } = useClerk();


    useEffect(() => {
        const handleClickOutside = (e) => {
          if (divref.current && !divref.current.contains(e.target)) {
            setShowSignOutPopUp(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut({ redirectUrl: "/" });
        } catch (error) {
            console.log("Error while signing out - ", error);
            setErrorMsg("Something went wrong!");
        }
    };


    return (
    <div ref={divref} className='h-fit w-full px-4 py-4'>
        <div className='w-full h-full  '>
            <div className='w-full text-start'>
                <h1 className='font-semibold text-gray-700'>SignOut</h1>
                <p className='text-sm text-gray-400'>Once deleted, you won’t be able to recover the card or its data.</p>
            </div>
            {   (errorMsg.trim()!=="") &&
                <div className='text-red-600 text-sm mt-2'>
                {errorMsg}
                </div>
            }
            <div className='w-full flex mt-4'>
                <button onClick={handleSignOut} className='flex-1 py-1 bg-red-600 rounded-md text-white font-semibold cursor-pointer outline-none border-none'>
                    SignOut
                </button>
            </div>
        </div>
    </div>
    )
}