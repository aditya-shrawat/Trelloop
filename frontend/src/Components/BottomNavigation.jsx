import React, { useContext, useEffect, useState } from 'react'
import { IoHome } from "react-icons/io5";
import { BsPersonWorkspace } from "react-icons/bs";
import { MdAdd } from "react-icons/md";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { TbCalendarClock } from "react-icons/tb";
import { Link, useLocation } from 'react-router-dom';

import { MdClose } from "react-icons/md";
import CreateBoard from './CreateBoard';
import CreateWorkspace from './CreateWorkspace';

const BottomNavigation = () => {
    const [activeTab, setActiveTab] = useState('home');
    const location = useLocation();
    const [showSlideUpComponent, setShowSlideUpComponent] = useState(false);

    const routeToTab = {
        '/home': 'Home',
        '/myBoards': 'Boards',
        '/deadlines': 'Deadlines',
        '/myWorkspaces':'Workspaces'
    };

    useEffect(() => {
        const currentTab = routeToTab[location.pathname];
        if (currentTab) {
            setActiveTab(currentTab);
        }
    }, [location.pathname]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (tab === 'add') {
            setShowSlideUpComponent(true);
        }
    };


    const handleCloseSlideUp = () => {
        setShowSlideUpComponent(false);
        setActiveTab(routeToTab[location.pathname])
    };

  return (
    <>
    {showSlideUpComponent && (
        <SlideUpComponent onClose={handleCloseSlideUp} />
    )}

    <nav className='w-full h-auto sm:hidden  fixed bottom-0 left-0 z-10 shadow-[0_-1px_2px_rgba(0,0,0,0.1)]'>             
        <div className="w-full h-[72px] p-3 px-4 bg-white flex justify-between">                      
            <Link to="/home" onClick={() => handleTabClick('Home')}                               
                    className={`w-12 h-12 ${activeTab === 'Home' ? 'bg-[#49C5C5]/20 backdrop-blur-xl text-teal-600' : 'text-gray-400'} rounded-full text-2xl flex justify-center items-center`}>                             
                <div className='h-fit w-fit'><IoHome /></div>        
            </Link>                     
            <Link to="/myWorkspaces" onClick={() => handleTabClick('Workspaces')}                                
                    className={`w-12 h-12 ${activeTab === 'Workspaces' ? 'bg-[#49C5C5]/20 backdrop-blur-xl text-teal-600' : 'text-gray-400'} rounded-full text-2xl flex justify-center items-center`}>                             
                <div className='h-fit w-fit'><BsPersonWorkspace /></div>                   
            </Link>                     
            <button onClick={() => handleTabClick('add')}
                className={`w-12 h-12 rounded-full text-4xl text-teal-600 ${showSlideUpComponent && 'bg-[#49C5C5]/20 backdrop-blur-xl'} flex justify-center items-center transition-all duration-300 ${showSlideUpComponent ? 'rotate-90' : 'rotate-0'}`}>
                <MdAdd />
            </button>                    
            <Link to="/myBoards" onClick={() => handleTabClick('Boards')}                               
                    className={`w-12 h-12 ${activeTab === 'Boards' ? 'bg-[#49C5C5]/20 backdrop-blur-xl text-teal-600' : 'text-gray-400'} rounded-full text-2xl flex justify-center items-center`}>                             
                <div className='h-fit w-fit'><TbLayoutDashboardFilled /></div>                 
            </Link>                     
            <Link to="/deadlines" onClick={() => handleTabClick('Deadlines')}                                
                    className={`w-12 h-12 ${activeTab === 'Deadlines' ? 'bg-[#49C5C5]/20 backdrop-blur-xl text-teal-600' : 'text-gray-400'} rounded-full text-2xl flex justify-center items-center`}>                              
                <div className='h-fit w-fit'><TbCalendarClock /></div>                  
            </Link>              
        </div>      
    </nav>
    </>
  )
}

export default BottomNavigation


const SlideUpComponent = ({ onClose }) => {
    const [creatingBoard,setCreatingBoard] = useState(false);
    const [creatingWorkspace,setCreatingworkspace] = useState(false)
    
    return (
        <>
            <div 
                className="fixed inset-0 bg-[rgba(0,0,0,0.45)] z-20 sm:hidden animate-fade-in"
                onClick={onClose}
            />

            <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden animate-slide-up ">
                <div className="bg-white rounded-t-3xl h-fit w-full shadow-[0_-1px_2px_rgba(0,0,0,0.1)]">
                    <div className="flex justify-between items-center p-4 border-b border-gray-300">
                        <h2 className="text-xl font-semibold text-gray-800">Create New</h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <MdClose size={20} />
                        </button>
                    </div>

                    <div className="p-4 h-full overflow-y-auto pb-10">
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={()=>{setCreatingBoard(true)}}
                                    className="bg-[#49C5C5]/20 backdrop-blur-xl rounded-xl p-4 text-center border border-teal-600">
                                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <TbLayoutDashboardFilled className="text-white text-xl" />
                                </div>
                                <h3 className="font-medium text-gray-700 mb-1">New Board</h3>
                                <p className="text-sm text-gray-500">Create a new project board</p>
                            </button>

                            <button onClick={()=>{setCreatingworkspace(true)}}
                                    className="bg-[#49C5C5]/20 backdrop-blur-xl rounded-xl p-4 text-center border border-teal-600">
                                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <BsPersonWorkspace className="text-white text-xl" />
                                </div>
                                <h3 className="font-medium text-gray-700 mb-1">New Workspace</h3>
                                <p className="text-sm text-gray-500">Create a new workspace</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {creatingBoard && <CreateBoard setCreatingBoard={setCreatingBoard}  />}
            {creatingWorkspace && <CreateWorkspace setCreatingworkspace={setCreatingworkspace}  />}
        </>
    );
};