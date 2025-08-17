const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter

import { userService } from '../services/user.service.js'
import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'
import { useStore } from '../services/store/store.js'

export function AppHeader() {
    const navigate = useNavigate()
    const { state, setUser } = useStore()
    const user = state.user
    const todos = state.todos
    const pct = (() => {
        if (!todos || todos.length === 0) return 0
        let done = 0
        for (let i = 0; i < todos.length; i++) if (todos[i].isDone) done++
        return Math.round((done / todos.length) * 100)
    })()

    function onLogout() {
        userService.logout()
            .then(() => { setUser(null) })
            .catch(() => { showErrorMsg('OOPs try again') })
    }

    function onSetUser(newUser) {
        setUser(newUser)
        navigate('/')
    }

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                {user ? (
                    <section>
                        <Link to={`/user/${user._id}`}>Hello {user.fullname} · {typeof user.balance === 'number' ? user.balance : 0}</Link>
                        <button onClick={onLogout}>Logout</button>
                    </section>
                ) : (
                    <section>
                        <LoginSignup onSetUser={onSetUser} />
                    </section>
                )}
                <nav className="app-nav">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/todo">Todos</NavLink>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                </nav>
            </section>
            <div className="progress" style={{ height: '6px', background: '#eee' }}>
                <div style={{ height: '100%', width: pct + '%', background: '#4caf50' }}></div>
            </div>
            <UserMsg />
        </header>
    )
}
