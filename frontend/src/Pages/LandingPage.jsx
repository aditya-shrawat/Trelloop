import React from 'react'
import { FaArrowRight } from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className='w-full'>
        <div className='w-full h-auto '>
            <header className='w-full h-20 bg-white shadow-[0px_4px_12px_rgba(12,12,13,0.2)] flex items-center justify-between px-6 lg:px-20 '>
                <div className=" inline-block font-bold text-[#49C5C5] text-2xl mr-6">
                    Trelloop
                </div>
                <div className='flex border-[1px] border-[#49C5C5] rounded-4xl shadow-lg'>
                    <button className='px-4 py-1 rounded-4xl font-semibold text-[#49C5C5] md:text-lg 
                        outline-none cursor-pointer hover:bg-gray-100 '>
                        Login
                    </button>
                    <button className='px-4 py-1 bg-[#49C5C5] rounded-4xl font-semibold text-white md:text-lg 
                        outline-none border-none cursor-pointer '>
                            Sign up
                    </button>
                </div>
            </header>
        </div>
            <main className='w-full'>
                <div className='max-w-[1200px] w-full h-auto px-4 m-auto'>
                    <div className='w-full h-auto md:h-[650px] md:flex py-8 md:py-0'>
                        <div className='w-full md:w-1/2 h-full px-2 flex justify-center items-center'>
                            <div>
                                <h1 className='text-4xl sm:text-5xl font-semibold sm:leading-15 break-words '>Manage Tasks,<br />Collaborate with Teams</h1>
                                <h4 className='text-gray-500 sm:text-lg mt-6 break-words  '>Trelloop is a powerful task management platform that helps teams organize projects, track progress, and collaborate efficiently in one place.</h4>
                                <div className=' mt-10'>
                                    <button className='px-4 md:px-6 py-2 bg-[#49C5C5] rounded-4xl font-semibold md:text-lg text-white 
                                        cursor-pointer outline-none border-none flex items-center shadow-lg '>
                                        Get started <FaArrowRight className='ml-3 md:text-lg' />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='w-full md:w-1/2 md:h-full px-2 flex justify-center items-center mt-12 md:mt-0 '>
                            <div className='w-auto max-h-[450px] h-full'>
                                <img src="/landingPageImage.png" className='w-full max-h-[450px] h-full drop-shadow-xl drop-shadow-[rgba(12,12,13,0.2)]' />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full bg-[#F7F9FC]'>
                    <div className='max-w-[1200px] w-full h-auto px-4 m-auto'>
                        <div className='w-full h-auto py-14 px-2'>
                            <div className='w-full flex justify-center'>
                                <div className='w-full md:w-[75%] px-4 text-center'>
                                    <h2 className=' text-3xl sm:text-4xl font-semibold break-words '>Key features</h2>
                                    <h4 className='text-gray-500 sm:text-lg mt-4 break-words  '>
                                        We provide the best task management solutions tailored to your needs, ensuring seamless project tracking and collaboration with powerful tools designed for efficiency.
                                    </h4>
                                </div>
                            </div>
                            
                            <div className='w-full pt-10 mt-6 flex flex-wrap gap-6'>
                                <div className=' max-w-[360px] w-full h-[380px] rounded-2xl p-4 flex justify-center items-center bg-white border-[1px] border-gray-300 hover:shadow-[0px_0px_15px_rgba(0,0,0,0.2)] '>
                                    <div className='w-auto h-auto'>
                                        <div className='h-auto w-auto inline-block'>
                                            <img src="/taskManagementImg.png"  className='w-[103px] h-[105px] '/>
                                        </div>
                                        <div className='w-full mt-4'>
                                            <h1 className='text-2xl font-semibold '>Task Management</h1>
                                            <h3 className='mt-4 text-gray-500'>Create, organize, and track tasks with ease. Set priorities, deadlines, and assign tasks to team members.</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className=' max-w-[360px] w-full h-[380px] rounded-2xl p-4 flex justify-center items-center bg-white border-[1px] border-gray-300 '>
                                    <div className='w-auto h-auto'>
                                        <div className='h-auto w-auto inline-block'>
                                            <img src="/teamCollabrationImg.png"  className='w-[103px] h-[105px] '/>
                                        </div>
                                        <div className='w-full mt-4'>
                                            <h1 className='text-2xl font-semibold '>Team Collaboration</h1>
                                            <h3 className='mt-4 text-gray-500 '>Work together seamlessly with shared workspaces, real-time updates, and team communication tools.</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className=' max-w-[360px] w-full h-[380px] rounded-2xl p-4 flex justify-center items-center bg-white border-[1px] border-gray-300 '>
                                    <div className='w-auto h-auto'>
                                        <div className='h-auto w-auto inline-block'>
                                            <img src="/workspacesImg.png"  className='w-[103px] h-[105px] '/>
                                        </div>
                                        <div className='w-full mt-4'>
                                            <h1 className='text-2xl font-semibold '>Workspaces</h1>
                                            <h3 className='mt-4 text-gray-500 '>Organize projects into dedicated workspaces with customizable layouts and project-specific settings.</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className=' max-w-[360px] w-full h-[380px] rounded-2xl p-4 flex justify-center items-center bg-white border-[1px] border-gray-300 '>
                                    <div className='w-auto h-auto'>
                                        <div className='h-auto w-auto inline-block'>
                                            <img src="/communicationImg.png"  className='w-[103px] h-[105px] '/>
                                        </div>
                                        <div className='w-full mt-4'>
                                            <h1 className='text-2xl font-semibold '>Integrated Communication</h1>
                                            <h3 className='mt-4 text-gray-500 '>Comment on tasks, share files, and discuss projects without leaving the platform.</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className=' max-w-[360px] w-full h-[380px] rounded-2xl p-4 flex justify-center items-center bg-white border-[1px] border-gray-300 '>
                                    <div className='w-auto h-auto'>
                                        <div className='h-auto w-auto inline-block'>
                                            <img src="/progressImg.png"  className='w-[103px] h-[105px] '/>
                                        </div>
                                        <div className='w-full mt-4'>
                                            <h1 className='text-2xl font-semibold '>Progress Tracking</h1>
                                            <h3 className='mt-4 text-gray-500 '>Monitor project progress with visual dashboards, progress reports, and performance metrics.</h3>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full '>
                    <div className='max-w-[1200px] w-full h-auto px-4 m-auto'>
                        <div className='w-full h-auto py-16 px-2'>
                            <div className='w-full flex justify-center'>
                                <div className='w-full md:w-[75%] px-4 text-center'>
                                    <h2 className=' text-3xl sm:text-4xl font-semibold break-words '>How Trelloop works</h2>
                                    <h4 className='text-gray-500 sm:text-lg mt-4 break-words  '>
                                        Our streamlined workflow helps your team stay organized and focus on what matters most.
                                    </h4>
                                </div>
                            </div>
                            <div className='w-full pt-8'>
                                <div className='w-full my-14 flex'>
                                    <div>
                                        <div className='h-32 w-32 mr-16 rounded-full bg-white flex justify-center items-center shadow-[0px_0px_12px_rgba(0,0,0,0.3)] '>
                                            <div className='h-20 w-20 rounded-full bg-[#49C5C5] flex justify-center items-center '>
                                                <span className='text-white font-bold text-4xl'>1</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-full flex flex-col justify-center'>
                                        <h1 className='text-3xl font-semibold '>Create Your Workspace</h1>
                                        <p className='mt-2 text-lg text-gray-500 '>Set up your team’s workspace in minutes. Customize it with your brand color, invite team members and organize projects with intuitive categories and labels.</p>
                                    </div>
                                </div>
                                <div className='w-full my-14 flex'>
                                    <div className='w-full flex flex-col justify-center'>
                                        <h1 className='text-3xl font-semibold '>Manage Tasks & Projects</h1>
                                        <p className='mt-2 text-lg text-gray-500 '>Break down projects into manageable tasks on boards, set priorities, assign responsibilities and track progress in real-time with our intuitive drag-and-drop interfaces.</p>
                                    </div>
                                    <div>
                                        <div className='h-32 w-32 ml-16 rounded-full bg-white flex justify-center items-center shadow-[0px_0px_12px_rgba(0,0,0,0.3)] '>
                                            <div className='h-20 w-20 rounded-full bg-[#49C5C5] flex justify-center items-center '>
                                                <span className='text-white font-bold text-4xl'>2</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full my-14 flex'>
                                    <div>
                                        <div className='h-32 w-32 mr-16 rounded-full bg-white flex justify-center items-center shadow-[0px_0px_12px_rgba(0,0,0,0.3)] '>
                                            <div className='h-20 w-20 rounded-full bg-[#49C5C5] flex justify-center items-center '>
                                                <span className='text-white font-bold text-4xl'>3</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-full flex flex-col justify-center'>
                                        <h1 className='text-3xl font-semibold '>Collaborate & Communicate</h1>
                                        <p className='mt-2 text-lg text-gray-500 '>Keep discussions organized with in-context comments and shared files. No more switching between multiple apps to get work done.</p>
                                    </div>
                                </div>
                                <div className='w-full mt-14 flex'>
                                    <div className='w-full flex flex-col justify-center'>
                                        <h1 className='text-3xl font-semibold '>Track & Optimize</h1>
                                        <p className='mt-2 text-lg text-gray-500 '>Gain insights with powerful analytics and reporting tools. Celebrate wins and continuously improve your team’s workflows.</p>
                                    </div>
                                    <div>
                                        <div className='h-32 w-32 ml-16 rounded-full bg-white flex justify-center items-center shadow-[0px_0px_12px_rgba(0,0,0,0.3)] '>
                                            <div className='h-20 w-20 rounded-full bg-[#49C5C5] flex justify-center items-center '>
                                                <span className='text-white font-bold text-4xl'>4</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full bg-[#F7F9FC] '>
                    <div className='max-w-[1200px] w-full h-auto px-4 m-auto'>
                        <div className='w-full h-full py-24 flex justify-center items-center'>
                            <div className='w-full md:w-[65%]'>
                                <div className='w-full text-center'>
                                    <h1 className='text-3xl sm:text-4xl font-semibold break-words '>Ready to transform your team’s work</h1>
                                    <p className='text-gray-500 sm:text-lg mt-4 break-words '>Join teams that use Trelloop to collaborate more effectively, deliver projects on time and achieve their goals. </p>
                                </div>
                                <div className='w-full h-auto mt-12 flex justify-center '>
                                    <div className='w-auto h-auto flex'>
                                        <input type="text" placeholder='Enter your email'
                                        className='border-none outline-none hidden sm:block max-w-[400px] px-4 py-1 text-lg md:text-xl rounded-xl bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.3)]' />
                                        <div>
                                            <button className='px-6 py-2 ml-6 bg-[#49C5C5] rounded-xl font-semibold text-lg md:text-2xl text-white 
                                            cursor-pointer outline-none border-none shadow-[0px_0px_15px_rgba(0,0,0,0.3)] '>
                                                Sign up - it's free
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

        {/* <footer className='w-full bg-[#49C5C5] '>
            <div className='max-w-[1200px] w-full h-auto py-20 px-4 m-auto'>
                <div className='w-full'>

                </div>
            </div>
        </footer> */}
    </div>
  )
}

export default LandingPage