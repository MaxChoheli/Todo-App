export function createTodoInitialState(filterBy) {
    return { todos: [], isLoading: false, filterBy }
}

export function todoReducer(state, action) {
    switch (action.type) {
        case 'LOAD_TODOS_START':
            return { ...state, isLoading: true }
        case 'LOAD_TODOS_SUCCESS':
            return { ...state, isLoading: false, todos: action.todos }
        case 'SET_FILTER': {
            const nextFilter = { ...state.filterBy, ...action.filterBy }
            if (JSON.stringify(nextFilter) === JSON.stringify(state.filterBy)) return state
            return { ...state, filterBy: nextFilter }
        }
        case 'ADD_TODO':
            return { ...state, todos: [action.todo, ...state.todos] }
        case 'UPDATE_TODO':
            return { ...state, todos: state.todos.map(t => (t._id === action.todo._id ? action.todo : t)) }
        case 'REMOVE_TODO':
            return { ...state, todos: state.todos.filter(t => t._id !== action.todoId) }
        default:
            return state
    }
}
