const { createContext, useContext, useReducer, useCallback, useEffect, useRef } = React
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
        case 'SET_FILTER': {
            const nextFilter = { ...state.filterBy, ...action.filterBy }
            if (JSON.stringify(nextFilter) === JSON.stringify(state.filterBy)) return state
            return { ...state, filterBy: nextFilter }
        }
        case 'ADD_TODO':
            return { ...state, todos: [action.todo, ...state.todos] }
        case 'UPDATE_TODO': {
            const prev = state.todos.find(t => t._id === action.todo._id)
            const becameDone = prev && !prev.isDone && !!action.todo.isDone
            const todos = state.todos.map(t => (t._id === action.todo._id ? action.todo : t))
            const user = becameDone && state.user
                ? { ...state.user, balance: (state.user.balance || 0) + 10 }
                : state.user
            return { ...state, todos, user }
        }
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
    const prevUserRef = useRef(state.user)

    useEffect(() => {
        if (state.user) {
            sessionStorage.setItem('user', JSON.stringify(state.user))
        }
        prevUserRef.current = state.user
    }, [state.user])

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
        if (state.user) {
            const full = await userService.getById(state.user._id)
            const updated = {
                ...full,
                activities: [...(full.activities || []), { txt: `Added a Todo: '${saved.txt}'`, at: Date.now() }],
                updatedAt: Date.now()
            }
            const logged = await userService.update(updated)
            dispatch({ type: 'SET_USER', user: logged })
        }
        return saved
    }, [state.user])

    const removeTodo = useCallback(async (todoId) => {
        let removedTxt = ''
        try {
            const t = await todoService.get(todoId)
            removedTxt = t.txt || ''
        } catch (e) { }
        await todoService.remove(todoId)
        dispatch({ type: 'REMOVE_TODO', todoId })
        if (state.user) {
            const full = await userService.getById(state.user._id)
            const updated = {
                ...full,
                activities: [...(full.activities || []), { txt: `Removed the Todo: '${removedTxt}'`, at: Date.now() }],
                updatedAt: Date.now()
            }
            const logged = await userService.update(updated)
            dispatch({ type: 'SET_USER', user: logged })
        }
    }, [state.user])

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
