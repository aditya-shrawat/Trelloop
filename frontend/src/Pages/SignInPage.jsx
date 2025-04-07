import React from 'react'

const SignInPage = () => {
  return (
    <div className='min-h-screen overflow-y-auto w-screen'>
        <div className='md:w-96 max-w-96 w-full px-4 py-6 rounded-lg bg-white absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] 
            sm:shadow-[0px_0px_10px_rgba(0,0,0,0.3)] flex flex-col items-center'>
            <div className='h-auto w-auto inline-block text-3xl font-bold text-[#49C5C5] mb-10'>
                Trelloop
            </div>
            <div className='w-full text-center text-gray-500 font-semibold text-lg mb-8'>
                Your personal task space, just a sign in away.
            </div>
            <form className='flex flex-col w-full'>
                <label className='mb-1 ' >Email</label>
                <input type="email" name='email'
                className='mb-4 h-10 p-1 px-2 text-lg rounded-lg border-[1px] border-gray-300 outline-none' />
                
                <label className='mb-1 ' >Password</label>
                <input type="password" name='password' 
                className='mb-4 h-10 p-1 px-2 text-lg rounded-lg border-[1px] border-gray-300 outline-none' />
                
                <button type='submit' className='bg-[#49C5C5] my-5 h-12 rounded-3xl cursor-pointer text-xl
                 text-white font-semibold hover:shadow-lg' >
                    Sign in
                </button>
                
                <div className='w-full text-center text-base'>
                    <p className='mb-5'>OR</p>
                    <p>No account?
                        <span className='hover:underline font-bold text-blue-800 cursor-pointer'>Create account</span>
                    </p>
                </div>
            </form>
        </div>
    </div>
  )
}

export default SignInPage