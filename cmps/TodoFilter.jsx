const { useState, useEffect } = React

export function TodoFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

    useEffect(() => {
        setFilterByToEdit({ ...filterBy })
    }, [filterBy])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        if (target.type === 'number' || target.type === 'range') value = +value || ''
        if (target.type === 'checkbox') value = target.checked
        const updated = { ...filterByToEdit, [field]: value }
        setFilterByToEdit(updated)
        onSetFilterBy(updated)
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { txt, importance, status } = filterByToEdit
    return (
        <section className="todo-filter">
            <h2>Filter Todos</h2>
            <form onSubmit={onSubmitFilter}>
                <input value={txt} onChange={handleChange} type="search" placeholder="By Txt" id="txt" name="txt" />
                <label htmlFor="importance">Importance: </label>
                <input value={importance} onChange={handleChange} type="number" placeholder="By Importance" id="importance" name="importance" />
                <label htmlFor="status">Status: </label>
                <select id="status" name="status" value={status || 'all'} onChange={handleChange}>
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="done">Done</option>
                </select>
                <button hidden>Set Filter</button>
            </form>
        </section>
    )
}