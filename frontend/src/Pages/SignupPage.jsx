import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSignUp } from "@clerk/clerk-react";

const initialSignupData={
    firstName:"",
    lastName:"",
    email:"",
    password:""
};

const getErrorMessage = (err) => {
  return (
    err.errors?.[0]?.message || err.message || "An unexpected error occurred"
  );
};


const SignupPage = () => {
    const navigate = useNavigate()
    const { isLoaded, signUp, setActive } = useSignUp();
    const [signupData,setSignupData] = useState(initialSignupData);
    const [verifying, setVerifying] = useState(false);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const inputChange = (e)=>{
        setSignupData({...signupData,[e.target.name]:e.target.value})

        if (errors.length > 0) {
            setErrors([]);
        }
    }

    const signupDataValidation = (formData) => {
        if (!formData.firstName || formData.firstName.length < 2) {
            setErrors([{ message: "First name must be at least 2 characters" }]);
            return false;
        }

        if (!formData.lastName || formData.lastName.length < 2) {
            setErrors([{ message: "Last name must be at least 2 characters" }]);
            return false;
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setErrors([{ message: "Please enter a valid email address" }]);
            return false;
        }

        if (!formData.password || formData.password.length < 8) {
            setErrors([{ message: "Password must be at least 8 characters" }]);
            return false;
        }

        return true;
    }

    const handleCodeChange =(e) => {
        const value = e.target.value.replace(/\D/g, ""); // allow digits
        setCode(value);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if(!isLoaded) return;

        const isValid = signupDataValidation(signupData);
        if (!isValid) return;

        setLoading(true);
        setErrors([])

        try {
            await signUp.create({
                first_name: signupData.firstName,
                last_name: signupData.lastName,
                email_address: signupData.email,
                password: signupData.password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setVerifying(true);
        } catch (error) {
            console.log("Error in handling singup - ",error)
            setErrors([{ message: getErrorMessage(error) }]);
        }
        finally {
            setLoading(false);
        }
    }

    const signUpWithGoogle = useCallback(async () => {
        if (!isLoaded) return;

        setLoading(true);
        setErrors([]);

        try {
            await signUp.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrlComplete: "/home",
            });
        } catch (err) {
            console.error("Google sign up error:", err);
            
            if (err.message?.includes("You're already signed in") || err.code === 'session_exists') {
                // User is already signed in
                navigate('/home');
            } else {
                setErrors([{ message: "Google sign up failed. Please try again." }]);
                setLoading(false);
            }
        }
    }, [isLoaded, signUp]);

    // Email Verification
    const completeVerificationFlow = useCallback(
        async (completeSignUp) => {
            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });

                navigate("/home", { replace: true });
            } else {
                setErrors([{ message: "Verification incomplete. Please try again." }]);
            }
        },
        [setActive, navigate]
    );

    const handleVerification = useCallback(
    async (e) => {
        e.preventDefault();
        if (!isLoaded || !code.trim()) return;

        setLoading(true);
        setErrors([]);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: code.trim(),
            });
            await completeVerificationFlow(completeSignUp);
        } catch (err) {
            console.error("Verification error:", err);
            setErrors([
                { message: "Invalid verification code. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    },
    [isLoaded, code, signUp, completeVerificationFlow, navigate]
);

  // Loading State
  if (!isLoaded) {
    return (
        <div className="max-w-[400px] mx-auto my-8 p-8 text-center">
        <div>Loading...</div>
        </div>
    );
  }


  return (
    <div className='overflow-y-auto w-full bg-white sm:bg-[#F0F4F8]'>
        <div className='md:w-[450px] max-w-[450px] w-full px-6 py-8 rounded-lg bg-white mx-auto sm:shadow-xl flex flex-col items-center my-14'>
            <div className='h-auto w-auto inline-block text-3xl font-bold text-teal-600 mb-2'>
                Trelloop
            </div>

            {
            (!verifying) ?
                (<div className='w-full'>
                    <div className='w-full text-center text-gray-500 mb-8'>
                        Sign up now and start managing your tasks effortlessly.
                    </div>

                    <button onClick={signUpWithGoogle}
                        type="button" disabled={loading}
                        className={`w-full px-3 py-3 text-white border-none rounded cursor-pointer mb-4 text-base font-medium transition-colors duration-200 ${
                            loading ? 'bg-[#ccc] cursor-not-allowed' : 'bg-[#db4437] cursor-pointer'
                        }`}
                        >
                        {loading ? 'Signing up...' : 'Continue with Google'}
                    </button>

                    <div className="text-center my-6 relative">
                        <span className="text-gray-400 bg-white px-4 relative z-10">OR</span>
                        <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300 m-0" />
                    </div>

                    {
                        errors.length > 0 && (
                            <div className='w-full text-red-500 px-2 py-1 my-4 border-[1px] border-red-500 rounded-md bg-red-100'>
                                {errors.map((error, index) => (
                                    <div key={index}>{error.message}</div>
                                ))}
                            </div>
                        )
                    }

                    <form className='flex flex-col w-full text-gray-700' onSubmit={handleSignUp}  >
                        <label className='mb-1 font-semibold' >First name</label>
                        <input type="text" name='firstName' onChange={(e)=>{inputChange(e)}}
                        className='mb-4 h-10 p-1 px-2 rounded-md border-[1px] border-gray-300 outline-teal-500' />
                        
                        <label className='mb-1 font-semibold' >Last name</label>
                        <input type="text" name='lastName' onChange={(e)=>{inputChange(e)}}
                        className='mb-4 h-10 p-1 px-2 rounded-md border-[1px] border-gray-300 outline-teal-500' />

                        <label className='mb-1 font-semibold' >Email</label>
                        <input type="email" name='email' onChange={(e)=>{inputChange(e)}}
                        className='mb-4 h-10 p-1 px-2 rounded-md border-[1px] border-gray-300 outline-teal-500' />
                        
                        <label className='mb-1 font-semibold' >Password</label>
                        <input type="password" name='password' onChange={(e)=>{inputChange(e)}} 
                        className='mb-4 h-10 p-1 px-2 rounded-md border-[1px] border-gray-300 outline-teal-500' />
                        
                        <button type='submit' disabled={loading} className='primary-button py-3 my-5 text-xl' >
                            {loading ? 'Signing up...' : 'Sign up'}
                        </button>
                        
                        <div className='w-full text-center text-base'>
                            <p>Already have an account?
                                <span onClick={()=>{navigate('/user/signin')}} className='hover:underline font-bold text-blue-800 cursor-pointer' >
                                    Sign in
                                </span>
                            </p>
                        </div>
                    </form>
                </div>)
            :
                (<div>
                    <h3 className="text-center text-gray-700 font-medium">Verify Your Email</h3>
                    <p className="mb-4 text-[#666]">
                        We've sent a verification code to{" "}
                        <strong>{signupData.email}</strong>. Please enter it below:
                    </p>

                    <form onSubmit={handleVerification}>
                        <div className="mb-8 text-gray-700">
                            <label className="block mb-1 font-medium">
                                Verification Code
                            </label>
                            <input type="text" value={code} onChange={handleCodeChange} required maxLength="6"
                                className="w-full p-3 border border-gray-300 outline-teal-500 rounded-md text-xl text-center tracking-[0.2em] box-border"
                                placeholder="000000"
                            />
                        </div>

                        {
                            errors.length > 0 && (
                                <div className='w-full text-red-500 px-2 py-1 my-4 border-[1px] border-red-500 rounded-md bg-red-100'>
                                    {errors.map((error, index) => (
                                        <div key={index}>{error.message}</div>
                                    ))}
                                </div>
                            )
                        }

                        <button type="submit" disabled={loading || !code.trim()}
                            className={`w-full p-3 text-white border-none outline-none rounded-md cursor-pointer text-base font-medium transition-colors duration-200 ease-in-out 
                                ${ loading || !code.trim() ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"}`}
                        >
                            {loading ? "Verifying..." : "Verify Email"}
                        </button>
                    </form>
                </div>)
            }
            <div id="clerk-captcha" style={{ marginBottom: "1rem" }}></div>
        </div>
    </div>
  )
}

export default SignupPage