import { useEffect } from "react"
import toast from "react-hot-toast";


const useBoardSocket = (socket,boardId)=>{
    useEffect(()=>{
        if(!socket || !boardId) {
            return;
        }

        socket.emit('join_board_room',{boardId});
    },[socket,boardId])
}

export default useBoardSocket ;