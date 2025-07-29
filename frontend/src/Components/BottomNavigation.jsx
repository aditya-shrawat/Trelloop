import React, { useContext, useEffect, useState } from 'react'
import { IoHome } from "react-icons/io5";
import { BsPersonWorkspace } from "react-icons/bs";
import { MdAdd } from "react-icons/md";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { TbCalendarClock } from "react-icons/tb";
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
    const [activeTab, setActiveTab] = useState('home');
    const location = useLocation();

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
            setShowTravelPlanner(true);
        }
    };


  return (
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
            <Link to="" onClick={() => handleTabClick('add')}                               
                    className={`w-12 h-12 rounded-full text-4xl text-teal-600 ${activeTab === 'add' && 'bg-[#49C5C5]/20 backdrop-blur-xl'} flex justify-center items-center`}>                             
                <MdAdd />                     
            </Link>                     
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
  )
}

export default BottomNavigation