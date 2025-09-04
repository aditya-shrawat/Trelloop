import { useEffect } from "react"


const useBoardSocket = (socket,boardId)=>{
    useEffect(()=>{
        if(!socket || !boardId) {
            console.log("socket or boardId not present")
            return;
        }

        socket.emit('join_board_room',{boardId});
        console.log("joined board room ");
    },[socket,boardId])
}

export default useBoardSocket ;