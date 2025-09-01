import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import { useApi } from "../../api/useApi";

const MyWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const api = useApi();

  const fetchWorkspaces = async () => {
    try {
      const response = await api.get(`/workspace/`);

      setWorkspaces(response.data.workspaces);
    } catch (error) {
      console.log("Error while fetching workspaces - ", error);
    } finally {
      setLoadingWorkspaces(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <div className="w-full">
      <div className="w-full sm:max-w-2xl h-auto p-4 sm:pl-8">
        <div className="w-full mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-2">
            Workspaces
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Your created and joined workspaces at a glance. Seamlessly
            collaborate with your team.
          </p>
        </div>
        <div className="w-full h-auto mt-2">
          {loadingWorkspaces ? (
            <div>loadingWorkspaces</div>
          ) : workspaces && workspaces.length !== 0 ? (
            workspaces.map((workspace) => (
              <Link
                to={`/workspace/${workspace.name.replace(/\s+/g, "")}/${
                  workspace._id
                }/home`}
                key={workspace._id}
                className="w-full px-2 py-2 my-2 hover:bg-gray-100 focus:bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer "
              >
                <div className="w-auto h-auto inline-block mr-3">
                  <span className="w-9 h-9 font-bold text-lg text-white bg-blue-300 rounded-md flex items-center justify-center ">
                    {workspace.name[0].toUpperCase()}
                  </span>
                </div>
                <div className="w-full font-semibold flex items-center justify-between">
                  <div className="line-clamp-2 break-words text-lg">
                    {workspace.name}
                  </div>{" "}
                  <div>
                    <IoMdArrowDropright className="ml-1 text-2xl" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-gray-400 py-10">
              <p className="text-lg font-medium">No workspaces found!</p>
              <p className="text-sm">
                You're not a member and haven't created any workspace yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyWorkspaces;
