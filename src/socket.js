import * as io from "socket.io-client";
import { roomUsers, userJoined, userLeft } from "./actions";

let socket;
export function getSocket(store) {
    if (!socket) {
        socket = io.connect();
        socket.on("roomUsers", data => {
            store.dispatch(roomUsers(data));
        });

        socket.on("userJoined", data => {
            store.dispatch(userJoined(data));
        });

        socket.on("userLeft", leftUserId => {
            store.dispatch(userLeft(leftUserId));
        });
    }
    return socket;
}
export function emit(event, data) {
    socket.emit(event, data);
}
