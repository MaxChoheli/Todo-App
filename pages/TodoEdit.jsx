import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { useStore } from "../services/store/store.js"

const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM

export function TodoEdit() {
    const { addTodo, saveTodo } = useStore()
    const [todoToEdit, setTodoToEdit] = useState(todoService.getEmptyTodo())
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.todoId) loadTodo()
    }, [])

    function loadTodo() {
        todoService.get(params.todoId)
            .then(setTodoToEdit)
            .catch(() => { })
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        if (target.type === 'number' || target.type === 'range') value = +value || ''
        if (target.type === 'checkbox') value = target.checked
        setTodoToEdit(prev => ({ ...prev, [field]: value }))
    }

    function onSaveTodo(ev) {
        ev.preventDefault()
        const action = todoToEdit._id ? saveTodo : addTodo
        action(todoToEdit)
            .then((savedTodo) => {
                navigate('/todo')
                showSuccessMsg(`Todo Saved (id: ${savedTodo._id})`)
            })
            .catch(() => {
                showErrorMsg('Cannot save todo')
            })
    }

    const { txt, importance, isDone, color } = todoToEdit

    return (
        <section className="todo-edit">
            <form onSubmit={onSaveTodo} >
                <label htmlFor="txt">Text:</label>
                <input onChange={handleChange} value={txt} type="text" name="txt" id="txt" />

                <label htmlFor="importance">Importance:</label>
                <input onChange={handleChange} value={importance} type="number" name="importance" id="importance" />

                <label htmlFor="isDone">isDone:</label>
                <input onChange={handleChange} checked={!!isDone} type="checkbox" name="isDone" id="isDone" />

                <label htmlFor="color">Color:</label>
                <input onChange={handleChange} value={color || '#ffffff'} type="color" name="color" id="color" />

                <button>Save</button>
            </form>
        </section>
    )
}