import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const initialSignupData={
    name:"",
    email:"",
    password:""
};

const SignupPage = () => {
    const navigate = useNavigate()
    const [signupData,setSignupData] = useState(initialSignupData);
    const [errMsg,setErrMsg] = useState('');

    const inputChange = (e)=>{
        setSignupData({...signupData,[e.target.name]:e.target.value})
    }

    const handleSubmit =async (e)=>{
        e.preventDefault();
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.post(`${BackendURL}/user/signup`,
                {email:signupData.email,name:signupData.name,password:signupData.password},
                {withCredentials: true}
            );
            if(response.status===201){
                navigate('/home');
            }
        } catch (error) {
            if(error.response && error.response.data.error){
                setErrMsg(error.response.data.error);
            }
            else{
                setErrMsg("Something went wrong, Please try again!");
            }
        }
    }

  return (
    <div className='min-h-screen overflow-y-auto w-screen'>
        <div className='md:w-96 max-w-96 w-full px-4 py-6 rounded-lg bg-white absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] 
            sm:shadow-[0px_0px_10px_rgba(0,0,0,0.3)] flex flex-col items-center'>
            <div className='h-auto w-auto inline-block text-3xl font-bold text-[#49C5C5] mb-8'>
                Trelloop
            </div>
            <div className='w-full text-center text-gray-500 font-semibold text-lg mb-8'>
                Sign up now and start managing your tasks effortlessly.
            </div>
            <form className='flex flex-col w-full' onSubmit={handleSubmit} >
            <label className='mb-1 ' >Full name</label>
                <input type="text" name='name' onChange={(e)=>{inputChange(e)}}
                className='mb-4 h-10 p-1 px-2 text-lg rounded-lg border-[1px] border-gray-300 outline-none' />
                
                <label className='mb-1 ' >Email</label>
                <input type="email" name='email' onChange={(e)=>{inputChange(e)}}
                className='mb-4 h-10 p-1 px-2 text-lg rounded-lg border-[1px] border-gray-300 outline-none' />
                
                <label className='mb-1 ' >Password</label>
                <input type="password" name='password' onChange={(e)=>{inputChange(e)}} 
                className='mb-4 h-10 p-1 px-2 text-lg rounded-lg border-[1px] border-gray-300 outline-none' />

                {errMsg!=='' && <div className='text-red-500 px-2 my-2' >{errMsg}</div> }
                
                <button type='submit' className='bg-[#49C5C5] my-5 h-12 rounded-3xl cursor-pointer text-xl
                 text-white font-semibold hover:shadow-lg' >
                    Sign up
                </button>
                
                <div className='w-full text-center text-base'>
                        <p className='mb-3'>OR</p>
                        <p>Already have an account?
                            <span onClick={()=>{navigate('/user/signin')}} className='hover:underline font-bold text-blue-800 cursor-pointer' >
                                Sign in
                            </span>
                        </p>
                    </div>
            </form>
        </div>
    </div>
  )
}

export default SignupPage