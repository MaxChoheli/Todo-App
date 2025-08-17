const { useEffect, useMemo } = React
import { Chart } from '../cmps/Chart.jsx'
import { useStore } from '../services/store/store.js'

export function Dashboard() {
    const { state, loadTodos } = useStore()
    const todos = state.todos

    useEffect(() => {
        if (!state.isLoading && (!todos || todos.length === 0)) loadTodos()
    }, [state.isLoading, todos])

    const importanceStats = useMemo(() => {
        if (!todos || todos.length === 0) return [
            { title: 'low', value: 0 },
            { title: 'normal', value: 0 },
            { title: 'urgent', value: 0 }
        ]
        let low = 0, normal = 0, urgent = 0
        for (let i = 0; i < todos.length; i++) {
            const t = todos[i]
            if (t.importance < 3) low++
            else if (t.importance < 7) normal++
            else urgent++
        }
        const total = todos.length
        return [
            { title: 'low', value: Math.round((low / total) * 100) },
            { title: 'normal', value: Math.round((normal / total) * 100) },
            { title: 'urgent', value: Math.round((urgent / total) * 100) }
        ]
    }, [todos])

    return (
        <section className="dashboard">
            <h1>Dashboard</h1>
            <h2>Statistics for {todos ? todos.length : 0} Todos</h2>
            <hr />
            <h4>By Importance</h4>
            <Chart data={importanceStats} />
        </section>
    )
}
