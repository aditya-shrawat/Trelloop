

export const registerUserSocket = (socket,userId)=>{
  if (!userId){
    return;
  }

  socket.emit("register_user_socket", { userId });
};

export const setupNotificationListener = (socket, setUnreadCount)=>{
  socket.on("new_notification", (notif) => {
    setUnreadCount((prev) => prev + 1);
  });
};

export const cleanupNotificationListener = (socket) => {
  socket.off("new_notification");
};

