import * as io from "socket.io-client";
import {
    loadUsers,
    userJoined,
    userLeft,
    updateCode,
    chatMessage,
    chatMessages
} from "./actions";

let socket;
export function getSocket(store) {
    if (!socket) {
        socket = io.connect();
        socket.on("loadUsers", data => {
            store.dispatch(loadUsers(data));
        });

        socket.on("userJoined", data => {
            console.log("user joined");
            store.dispatch(userJoined(data));
        });

        socket.on("userLeft", leftUserId => {
            console.log("user left");
            store.dispatch(userLeft(leftUserId));
        });
        socket.on("updateCode", code => {
            store.dispatch(updateCode(code));
        });
        socket.on("chatMessage", message => {
            store.dispatch(chatMessage(message));
        });

        socket.on("chatMessages", messages => {
            console.log("messages in socket.js");
            store.dispatch(chatMessages(messages));
        });
    }
    return socket;
}
export function emit(event, data) {
    socket.emit(event, data);
}
