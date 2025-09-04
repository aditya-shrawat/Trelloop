let io;

export const setSocketInstance = (socketInstance) => {
    io = socketInstance;
};

export const getSocketInstance = () => {
    return io;
};