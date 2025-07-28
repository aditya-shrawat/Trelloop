import React from 'react'
import { Outlet } from "react-router-dom";
import Header from './Header';

const Layout = () => {
  return (
    <div className='w-full h-screen flex flex-col'>
        <Header />
        <div className='w-full h-full pt-14'>
            <Outlet />
        </div>
    </div>
  )
}

export default Layout