export function loadUsers(users) {
    return {
        type: "ROOM_USERS",
        users
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

export function updateCode(code) {
    return {
        type: "UPDATE_CODE",
        code: code.code
    };
}
