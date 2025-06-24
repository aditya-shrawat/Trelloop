import { io } from "socket.io-client";

const BackendURL = import.meta.env.VITE_BackendURL;
const socket = io(BackendURL);

export default socket;
