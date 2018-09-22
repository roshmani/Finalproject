const INITIAL_STATE = {};

export function reducer(state = INITIAL_STATE, action) {
    if (action.type == "ONLINE_USERS") {
        state = { ...state, onlineUsers: action.onlineUsers };
    }

    if (action.type == "USER_JOINED") {
        state = {
            ...state,
            onlineUsers: [action.joinedUser, ...state.onlineUsers]
        };
    }
    if (action.type == "USER_LEFT") {
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(
                user => user.id != action.leftUserId
            )
        };
    }
    return state;
}
