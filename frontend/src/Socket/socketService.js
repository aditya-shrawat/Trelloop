

export const registerUserSocket = (socket,userId)=>{
  if (!userId){
    console.log("Failed to register user socket, missing userId");
    return;
  }

  socket.emit("register_user_socket", { userId });
};

export const setupNotificationListener = (socket, setUnreadCount)=>{
  socket.on("new_notification", (notif) => {
    console.log(notif.message);
    setUnreadCount((prev) => prev + 1);
  });
};

export const cleanupNotificationListener = (socket) => {
  socket.off("new_notification");
};

