const Router = ReactRouterDOM.HashRouter
const { Routes, Route } = ReactRouterDOM

import { AppHeader } from "./cmps/AppHeader.jsx"
import { Home } from "./pages/Home.jsx"
import { About } from "./pages/About.jsx"
import { TodoIndex } from "./pages/TodoIndex.jsx"
import { TodoDetails } from "./pages/TodoDetails.jsx"
import { TodoEdit } from "./pages/TodoEdit.jsx"
import { AboutTeam } from "./cmps/AboutTeam.jsx"
import { AboutVision } from "./cmps/AboutVision.jsx"
import { Dashboard } from "./pages/Dashboard.jsx"
import { UserDetails } from "./pages/UserDetails.jsx"
import { StoreProvider, useStore } from './services/store/store.js'

function FooterProgress() {
    const { state } = useStore()
    const todos = state.todos
    const pct = (() => {
        if (!todos || todos.length === 0) return 0
        let done = 0
        for (let i = 0; i < todos.length; i++) if (todos[i].isDone) done++
        return Math.round((done / todos.length) * 100)
    })()
    return (
        <footer className="app-footer" style={{ padding: '8px 16px' }}>
            <div className="progress" style={{ height: '6px', background: '#eee' }}>
                <div style={{ height: '100%', width: pct + '%', background: '#4caf50' }}></div>
            </div>
        </footer>
    )
}

export function RootCmp() {
    return (
        <Router>
            <StoreProvider>
                <section className="app main-layout">
                    <AppHeader />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />}>
                                <Route path="team" element={<AboutTeam />} />
                                <Route path="vision" element={<AboutVision />} />
                            </Route>
                            <Route path="/todo/:todoId" element={<TodoDetails />} />
                            <Route path="/todo/edit/:todoId" element={<TodoEdit />} />
                            <Route path="/todo/edit" element={<TodoEdit />} />
                            <Route path="/todo" element={<TodoIndex />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/user/:userId" element={<UserDetails />} />
                        </Routes>
                    </main>
                    <FooterProgress />
                </section>
            </StoreProvider>
        </Router>
    )
}
