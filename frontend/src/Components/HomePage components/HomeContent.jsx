import React from 'react'

const HomeContent = () => {
  return (
    <div className=' w-full h-full py-4'>
        <div className='w-full h-full'>
            <div className='w-full h-fit rounded-lg overflow-hidden border-[0.5px] border-gray-300 shadow-[0px_2px_6px_rgba(12,12,13,0.2)]'>
                <div className='w-full h-52 bg-[#C7EBFF] '>
                    <img src={`/reminder2.png`} className='h-full w-full object-contain' />
                </div>
                <div className='w-full text-center p-6'>
                    <h1 className='text-lg font-semibold text-gray-700'>Plan smarter. Work better.</h1>
                    <h3 className='text-sm text-gray-500'>Collaborate with others, manage your to-do's, and keep track of your most important work.</h3>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HomeContent