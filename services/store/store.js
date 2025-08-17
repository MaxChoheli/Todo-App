const { createContext, useContext, useReducer, useCallback } = React
import { todoService } from '../../services/todo.service.js'
import { userService } from '../../services/user.service.js'

const StoreContext = createContext(null)

const initialState = {
    todos: [],
    isLoading: false,
    filterBy: todoService.getDefaultFilter(),
    user: userService.getLoggedinUser() || null
}

function reducer(state, action) {
    switch (action.type) {
        case 'LOAD_TODOS_START':
            return { ...state, isLoading: true }
        case 'LOAD_TODOS_SUCCESS':
            return { ...state, isLoading: false, todos: action.todos }
        case 'SET_FILTER':
            const nextFilter = { ...state.filterBy, ...action.filterBy }
            if (JSON.stringify(nextFilter) === JSON.stringify(state.filterBy)) return state
            return { ...state, filterBy: nextFilter }
        case 'ADD_TODO':
            return { ...state, todos: [action.todo, ...state.todos] }
        case 'UPDATE_TODO':
            return { ...state, todos: state.todos.map(t => (t._id === action.todo._id ? action.todo : t)) }
        case 'REMOVE_TODO':
            return { ...state, todos: state.todos.filter(t => t._id !== action.todoId) }
        case 'SET_USER':
            return { ...state, user: action.user }
        default:
            return state
    }
}

export function StoreProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)

    const loadTodos = useCallback(async (filterBy) => {
        dispatch({ type: 'LOAD_TODOS_START' })
        const todos = await todoService.query(filterBy || state.filterBy)
        dispatch({ type: 'LOAD_TODOS_SUCCESS', todos })
    }, [state.filterBy])

    const setFilter = useCallback((filterBy) => {
        dispatch({ type: 'SET_FILTER', filterBy })
    }, [])

    const saveTodo = useCallback(async (todo) => {
        const saved = await todoService.save(todo)
        dispatch({ type: 'UPDATE_TODO', todo: saved })
        return saved
    }, [])

    const addTodo = useCallback(async (todo) => {
        const saved = await todoService.save(todo)
        dispatch({ type: 'ADD_TODO', todo: saved })
        return saved
    }, [])

    const removeTodo = useCallback(async (todoId) => {
        await todoService.remove(todoId)
        dispatch({ type: 'REMOVE_TODO', todoId })
    }, [])

    const toggleTodo = useCallback(async (todo) => {
        const toSave = { ...todo, isDone: !todo.isDone }
        const saved = await todoService.save(toSave)
        dispatch({ type: 'UPDATE_TODO', todo: saved })
        return saved
    }, [])

    const setUser = useCallback((user) => {
        dispatch({ type: 'SET_USER', user })
    }, [])

    const value = { state, loadTodos, setFilter, saveTodo, addTodo, removeTodo, toggleTodo, setUser }
    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
    return useContext(StoreContext)
}