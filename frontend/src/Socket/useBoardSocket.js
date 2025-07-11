import { useEffect } from "react"


const useBoardSocket = (socket,boardId,handlers={})=>{
    useEffect(()=>{
        if(!socket || !boardId) {
            console.log("socket or boardId not present")
            return;
        }

        socket.emit('join_board_room',{boardId});
        console.log("joinded board room ")

        /******* handle board events to update in real time */
    },[socket,boardId])
}

export default useBoardSocket ;