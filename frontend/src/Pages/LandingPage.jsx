import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { BsPersonWorkspace } from "react-icons/bs";
import { LuMessagesSquare } from "react-icons/lu";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { VscProject } from "react-icons/vsc";
import { LuCalendarCheck2 } from "react-icons/lu";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";
import { FaChartLine } from "react-icons/fa";

const featuresCards = [
  {
    icon: <LuCalendarCheck2 />,
    title: "Task Management",
    description:
      "Create, organize, and track tasks with ease. Set priorities, deadlines, and assign tasks to team members.",
  },
  {
    icon: <FaUserGroup />,
    title: "Team Collaboration",
    description:
      "Work together seamlessly with shared workspaces, real-time updates, and team communication tools.",
  },
  {
    icon: <BsPersonWorkspace />,
    title: "Workspaces",
    description:
      "Organize projects into dedicated workspaces with customizable layouts and project-specific settings.",
  },
  {
    icon: <MdOutlineMarkUnreadChatAlt />,
    title: "Integrated Communication",
    description:
      "Comment on tasks, share files, and discuss projects without leaving the platform.",
  },
  {
    icon: <FaChartLine />,
    title: "Progress Tracking",
    description:
      "Monitor project progress with visual dashboards, progress reports, and performance metrics.",
  },
];

const LandingPage = () => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="z-0 pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-teal-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full h-auto relative">
        {/* Grid pattern overlay */}
        <div
          className="z-0 pointer-events-none absolute inset-0 
          bg-[linear-gradient(rgba(20,184,166,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.07)_1px,transparent_1px)] bg-[size:64px_64px]"
        ></div>

        <header className="w-full z-20 flex items-center justify-between px-6 py-6">
          <div className=" inline-block font-bold text-teal-600 text-2xl mr-4">
            Trelloop
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 sm:px-6 py-2 text-slate-600 hover:text-slate-900 font-semibold border-[1px] border-transparent hover:border-gray-200 rounded-md transition-all duration-200 outline-none cursor-pointer">
              Login
            </button>
            <button className="primary-button px-4 sm:px-6 py-2">
              Sign up
            </button>
          </div>
        </header>
        <main className="max-w-7xl z-10 px-6 pt-6 pb-12 sm:py-12 md:pb-24 mx-auto">
          <div className="w-full h-auto md:flex md:justify-between md:items-center">
            <div className="space-y-8 md:mr-8">
              <div className="space-y-4">
                {/* <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
                  <span className="text-sm font-medium text-gray-600">
                    ✨ Task Management Platform
                  </span>
                </div> */}
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-gray-800">Manage Tasks,</span>
                  <br />
                  <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                    Collaborate with Teams
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Trelloop is a powerful task management platform that helps
                  teams organize projects, track progress, and collaborate
                  efficiently in one place.
                </p>
              </div>
              <div>
                <button className="primary-button px-6 py-3 group flex items-center justify-center">
                  Get started
                  <div className="ml-3 w-fit h-fit group-hover:translate-x-1 transition-transform">
                    <FaArrowRight />
                  </div>
                </button>
              </div>
            </div>
            <div className="w-full md:w-fit flex justify-center md:justify-end items-center mt-12 md:mt-0 ">
              <div className="w-auto sm:min-w-[360px] max-h-[450px] h-full">
                <img
                  src="/landingPageImage.png"
                  className="w-full max-h-[450px] h-full drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      <section>
        <div className="max-w-7xl mx-auto px-4 z-10">
            <div className="w-full h-auto py-14 px-2">
              <div className="w-full flex justify-center">
                <div className="w-full px-4 text-center">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400 bg-clip-text text-transparent">
                      Key Features
                    </span>
                  </h2>
                  <p className="md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    We provide the best task management solutions tailored to
                    your needs, ensuring seamless project tracking and
                    collaboration with powerful tools designed for efficiency.
                  </p>
                </div>
              </div>

              <div className="w-full pt-10 mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                {featuresCards.map((item, index) => (
                  <div key={index}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="w-auto h-auto">
                      <div className="w-fit h-fit p-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg text-white text-2xl">
                        {item.icon}
                      </div>
                      <div className="w-full mt-4">
                        <h1 className="text-xl text-gray-700 font-semibold ">
                          {item.title}
                        </h1>
                        <h3 className="text-gray-500">{item.description}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
    </section>

    <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-slate-800">Transform Your</span>
            <br />
            <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400 bg-clip-text text-transparent">
              Workflow Today
            </span>
          </h2>
          <p className=" md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Experience the power of seamless collaboration with our intuitive platform designed for modern teams
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-teal-400 via-teal-500 to-teal-600 rounded-full hidden lg:block">
            <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-transparent to-teal-400 rounded-full"></div>
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-transparent to-teal-600 rounded-full"></div>
          </div>

          <div className="lg:space-y-24">
            {/* Step 1 - Left Side */}
            <div className="relative flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 lg:pr-16 mb-8 lg:mb-0">
                <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-lg hover:shadow-xl border border-white/30 transition-all duration-500">
                  <div className="flex items-center mb-6">
                    <div className=" lg:hidden p-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                      <BsPersonWorkspace className="text-2xl text-white"/>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-teal-600 mb-1">STEP 01</div>
                      <h3 className="text-2xl font-bold text-slate-800">Create Your Workspace</h3>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    Set up your team's workspace in minutes. Customize it with your brand color, invite team members and
                    organize projects with intuitive categories and labels.
                  </p>
                </div>
              </div>

              {/* Timeline Node */}
              <div className="absolute left-1/2 transform -translate-x-1/2 items-center justify-center z-10 hidden lg:flex">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <BsPersonWorkspace className="text-2xl text-white"/>
                </div>
              </div>

              <div className="lg:w-1/2 lg:pl-16"></div>
            </div>

            {/* Step 2 - Right Side */}
            <div className="relative flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 lg:pr-16"></div>

              {/* Timeline Node */}
              <div className="absolute left-1/2 transform -translate-x-1/2 items-center justify-center z-10 hidden lg:flex">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <VscProject className="text-2xl text-white"/>
                </div>
              </div>

              <div className="lg:w-1/2 lg:pl-16 mb-8 lg:mb-0">
                <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-lg hover:shadow-xl border border-white/30 transition-all duration-500">
                  <div className="flex items-center mb-6">
                    <div className="lg:hidden p-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                      <VscProject className="text-2xl text-white"/>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-teal-600 mb-1">STEP 02</div>
                      <h3 className="text-2xl font-bold text-slate-800">Manage Tasks & Projects</h3>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    Break down projects into manageable tasks on boards, set priorities, assign responsibilities and
                    track progress in real-time with our intuitive drag-and-drop interfaces.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 - Left Side */}
            <div className="relative flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 lg:pr-16 mb-8 lg:mb-0">
                <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-lg hover:shadow-xl border border-white/30 transition-all duration-500">
                  <div className="flex items-center mb-6">
                    <div className="lg:hidden p-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                      <LuMessagesSquare className="text-2xl text-white"/>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-teal-600 mb-1">STEP 03</div>
                      <h3 className="text-2xl font-bold text-slate-800">Collaborate & Communicate</h3>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    Keep discussions organized with in-context comments and shared files. No more switching between
                    multiple apps to get work done.
                  </p>
                </div>
              </div>

              {/* Timeline Node */}
              <div className="absolute left-1/2 transform -translate-x-1/2 items-center justify-center z-10 hidden lg:flex">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <LuMessagesSquare className="text-2xl text-white"/>
                </div>
              </div>

              <div className="lg:w-1/2 lg:pl-16"></div>
            </div>

            {/* Step 4 - Right Side */}
            <div className="relative flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 lg:pr-16"></div>

              {/* Timeline Node */}
              <div className="absolute left-1/2 transform -translate-x-1/2 items-center justify-center z-10 hidden lg:flex">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <TbBrandGoogleAnalytics className="text-2xl text-white"/>
                </div>
              </div>

              <div className="lg:w-1/2 lg:pl-16 mb-8 lg:mb-0">
                <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-lg hover:shadow-xl border border-white/30 transition-all duration-500">
                  <div className="flex items-center mb-6">
                    <div className="lg:hidden p-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                      <TbBrandGoogleAnalytics className="text-2xl text-white"/>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-teal-600 mb-1">STEP 04</div>
                      <h3 className="text-2xl font-bold text-slate-800">Track & Optimize</h3>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    Gain insights with powerful analytics and reporting tools. Celebrate wins and continuously improve
                    your team's workflows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-24">
          <div className="bg-gradient-to-r from-teal-500/10 to-teal-600/10 backdrop-blur-sm rounded-3xl p-12 border border-teal-200/30 shadow-2xl">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Ready to Transform Your Workflow?</h3>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands of teams who have already revolutionized their productivity with Trelloop
            </p>
            <div className="flex justify-center">
              <button className="primary-button px-6 py-3 group flex items-center justify-center">
                Get started
                <div className="ml-3 w-fit h-fit group-hover:translate-x-1 transition-transform">
                  <FaArrowRight />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl font-bold text-white">Trelloop</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6">
                A personal project built with passion to help teams organize
                tasks and collaborate more effectively. Crafted with modern web
                technologies and user-centered design.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-slate-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <svg
                    className="w-5 h-5 text-slate-400 group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </button>
                <button className="w-10 h-10 bg-slate-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <svg
                    className="w-5 h-5 text-slate-400 group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
                <button className="w-10 h-10 bg-slate-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <svg
                    className="w-5 h-5 text-slate-400 group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Project</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Demo
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Source Code
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Connect</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Get in Touch
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Feedback
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Bug Reports
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Feature Requests
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-slate-400 text-sm text-center md:text-left">
                © 2024 Trelloop. Made with ❤️
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
