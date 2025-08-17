import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { useStore } from "../services/store/store.js"

const { useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

export function TodoIndex() {
    const { state, loadTodos, removeTodo, toggleTodo, setFilter } = useStore()
    const { todos, isLoading, filterBy } = state

    const [searchParams, setSearchParams] = useSearchParams()
    const paramsFilter = todoService.getFilterFromSearchParams(searchParams)

    useEffect(() => {
        if (JSON.stringify(paramsFilter) !== JSON.stringify(filterBy)) setFilter(paramsFilter)
    }, [])

    useEffect(() => {
        const params = {}
        for (const k in filterBy) {
            const v = filterBy[k]
            if (v !== '' && v !== 'all' && v !== 0) params[k] = v
        }
        setSearchParams(params, { replace: true })
        loadTodos()
    }, [filterBy])

    function onRemoveTodo(todoId) {
        const ok = confirm('Are you sure you want to delete this todo?')
        if (!ok) return
        removeTodo(todoId)
            .then(() => showSuccessMsg('Todo removed'))
            .catch(() => showErrorMsg('Cannot remove todo ' + todoId))
    }

    function onToggleTodo(todo) {
        toggleTodo(todo)
            .then((savedTodo) => showSuccessMsg(savedTodo.isDone ? 'Todo is done' : 'Todo back on your list'))
            .catch(() => showErrorMsg('Cannot toggle todo'))
    }

    if (isLoading) return <div>Loading...</div>
    if (!todos) return <div>Loading...</div>

    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy} onSetFilterBy={setFilter} />
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
            <hr />
            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}