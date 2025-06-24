import { useEffect } from "react";
import socket from "./socket";

const WorkspaceSocket = (currentUser, setUnreadCount)=> {
  // console.log("Current user is passed",currentUser)

  if (!currentUser.id) {
    console.log("failed in handling socket at frontend",currentUser)
    return;
  }

  socket.emit("register_user_socket", { userId: currentUser.id });

  // new notifications received
  socket.on("new_notification", (notif) => {
    console.log(notif.message);
    setUnreadCount((prev) => prev + 1);
  });

  // socket.on("workspace_invite_received", (data) => {
  //   console.log(data.message);
  // });
};

export default WorkspaceSocket;