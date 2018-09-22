export function onlineUsers(onlineUsers) {
    return {
        type: "ONLINE_USERS",
        onlineUsers
    };
}
export function userJoined(joinedUser) {
    return {
        type: "USER_JOINED",
        joinedUser
    };
}

export function userLeft(leftUserId) {
    return {
        type: "USER_LEFT",
        leftUserId
    };
}
