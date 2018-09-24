const INITIAL_STATE = {
    users: [],
    code: ""
};

export function reducer(state = INITIAL_STATE, action) {
    if (action.type == "ROOM_USERS") {
        state = { ...state, users: action.users };
    }

    if (action.type == "USER_JOINED") {
        state = {
            ...state,
            onlineUsers: [action.joinedUser, ...state.users]
        };
    }
    if (action.type == "USER_LEFT") {
        state = {
            ...state,
            users: state.users.filter(user => user.id != action.leftUserId)
        };
    }

    if (action.type == "UPDATE_CODE") {
        state = { ...state, code: action.code };
    }
    return state;
}
