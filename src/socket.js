import * as io from "socket.io-client";

let socket;
export function getSocket(store) {
    if (!socket) {
        socket = io.connect();
    }
    return socket;
}
export function emit(event, data) {
    socket.emit(event, data);
}
