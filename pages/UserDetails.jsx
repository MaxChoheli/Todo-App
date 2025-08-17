import { userService } from '../services/user.service.js'
import { useStore } from '../services/store/store.js'
import { utilService } from '../services/util.service.js'

const { useEffect, useState } = React
const { useParams } = ReactRouterDOM

export function UserDetails() {
    const { state, setUser } = useStore()
    const params = useParams()
    const [fullUser, setFullUser] = useState(null)
    const isOwn = state.user && state.user._id && state.user._id === params.userId

    useEffect(() => {
        userService.getById(params.userId).then(setFullUser)
    }, [params.userId])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        if (field === 'prefs.color') {
            const prefs = fullUser && fullUser.prefs ? { ...fullUser.prefs } : {}
            prefs.color = value
            setFullUser(prev => ({ ...prev, prefs }))
            return
        }
        if (field === 'prefs.bgColor') {
            const prefs = fullUser && fullUser.prefs ? { ...fullUser.prefs } : {}
            prefs.bgColor = value
            setFullUser(prev => ({ ...prev, prefs }))
            return
        }
        setFullUser(prev => ({ ...prev, [field]: value }))
    }

    function onSave(ev) {
        ev.preventDefault()
        userService.update(fullUser).then(u => {
            setUser(u)
            setFullUser(prev => ({ ...prev, fullname: u.fullname, balance: u.balance, prefs: u.prefs }))
        })
    }

    if (!fullUser) return <div>Loading...</div>

    const textColor = fullUser && fullUser.prefs && fullUser.prefs.color ? fullUser.prefs.color : 'inherit'
    const bgColor = fullUser && fullUser.prefs && fullUser.prefs.bgColor ? fullUser.prefs.bgColor : 'transparent'

    return (
        <section className="user-details" style={{ color: textColor, background: bgColor, padding: '1rem', borderRadius: '8px' }}>
            <h2>User Details</h2>
            {isOwn ? (
                <form onSubmit={onSave} style={{ display: 'grid', gap: '0.5rem', maxWidth: '400px' }}>
                    <label>Full name</label>
                    <input name="fullname" value={fullUser.fullname || ''} onChange={handleChange} />
                    <label>Text color</label>
                    <input type="color" name="prefs.color" value={(fullUser.prefs && fullUser.prefs.color) ? fullUser.prefs.color : '#000000'} onChange={handleChange} />
                    <label>Background color</label>
                    <input type="color" name="prefs.bgColor" value={(fullUser.prefs && fullUser.prefs.bgColor) ? fullUser.prefs.bgColor : '#ffffff'} onChange={handleChange} />
                    <button>Save</button>
                </form>
            ) : (
                <div>
                    <h3>{fullUser.fullname}</h3>
                </div>
            )}
            <h3 style={{ marginTop: '1rem' }}>Activities</h3>
            <ul>
                {(fullUser.activities || []).slice().reverse().map((act, idx) => (
                    <li key={idx}>{utilService.timeAgo(act.at)}: {act.txt}</li>
                ))}
            </ul>
        </section>
    )
}
