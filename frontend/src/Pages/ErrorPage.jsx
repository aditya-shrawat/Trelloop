import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div className='h-screen w-screen flex justify-center items-center  '>
      <div className=' w-80 md:w-1/2 h-auto text-center flex flex-col justify-between items-center'>
        <div className='w-full flex justify-center items-center mb-10'><h1 className='font-bold text-[#49C5C5] text-5xl'>Trelloop</h1></div>
        <h1 className='text-2xl font-bold text-gray-600'>Oops!<br/>We can't find the page you're looking for.</h1>
        <Link to={'/'} className='bg-[#49C5C5] mt-6 text-xl font-bold text-white px-5 py-3 rounded-lg cursor-pointer hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] '>Go to home</Link>
      </div>
    </div>
  )
}

export default ErrorPage