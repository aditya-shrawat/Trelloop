import { useEffect } from "react";


const useWorkspaceSocket = (socket,workspaceId)=>{
  useEffect(()=>{
    if(!socket || !workspaceId){
      console.log("socket or workspace not present ");
      return ;
    }

    socket.emit("join_workspace_room",{workspaceId})
    console.log("joined workspace room")
  },[socket,workspaceId]);
}

export default useWorkspaceSocket;