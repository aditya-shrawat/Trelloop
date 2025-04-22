import React, { useEffect, useRef } from "react";

const CreateBoard = ({ setCreatingBoard }) => {
  const divref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (divref.current && !divref.current.contains(e.target)) {
        setCreatingBoard(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-screen h-screen overflow-x-hidden z-20 fixed top-0 left-0 bg-[rgba(0,0,0,0.75)] ">
      <div
        ref={divref}
        className=" max-w-[95%] sm:max-w-md md:max-w-lg w-full 
                absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-8 py-12 bg-white rounded-xl border-[1px] border-gray-300 "
      >
        <div className="w-full h-auto">
          <h1 className="text-xl font-semibold  ">Create Board</h1>
          <h3 className=" text-gray-500 mt-2 ">
          Boards help you divide tasks, track progress, and keep your team aligned.
          </h3>
        </div>
        <div className="flex flex-col mt-8">
          <label className="mb-1 font-semibold ">Board name</label>
          <input
            type="text" name="boardName"
            className="mb-4 h-10 p-1 px-2 text-lg rounded-lg border-[1px] border-gray-300 outline-none"
          />
        </div>
        <div className="flex flex-col mt-4">
          <label className="mb-1 font-semibold ">Workspace name</label>
          <input
            type="text" name="workspaceName"
            className="mb-4 h-10 p-1 px-2 text-lg rounded-lg border-[1px] border-gray-300 outline-none"
          />
        </div>
        <div className="mt-6">
          <button className="bg-[#49C5C5] hover:bg-[#5fcaca] hover:shadow-[0px_4px_8px_rgba(12,12,13,0.2)] w-full py-2 font-semibold text-lg text-white rounded-xl 
          cursor-pointer outline-none border-none ">
            Create board
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoard;
