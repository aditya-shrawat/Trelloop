import { useEffect } from "react";


const useWorkspaceSocket = (socket,workspaceId)=>{
  useEffect(()=>{
    if(!socket || !workspaceId){
      return ;
    }

    socket.emit("join_workspace_room",{workspaceId})
  },[socket,workspaceId]);
}

export default useWorkspaceSocket;