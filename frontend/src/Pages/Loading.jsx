import React from 'react'

const Loading = () => {
  return (
    <div className='bg-white z-50 h-screen w-full flex items-center justify-center'>
      <div className="font-bold text-teal-600 text-4xl">
        <img 
          src="/logo2.png" 
          className="h-14 mr-4 animate-spin" 
        />
      </div>
    </div>
  )
}

export default Loading