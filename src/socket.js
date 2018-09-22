import * as io from "socket.io-client";
import { onlineUsers, userJoined, userLeft } from "./actions";

let socket;
export function getSocket(store) {
    if (!socket) {
        socket = io.connect();
        socket.on("onlineUsers", data => {
            store.dispatch(onlineUsers(data));
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
