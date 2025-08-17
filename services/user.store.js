export function createUserInitialState(user) {
    return { user }
}

export function userReducer(state, action) {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.user }
        default:
            return state
    }
}
