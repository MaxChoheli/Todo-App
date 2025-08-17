import { storageService } from "./async-storage.service.js"

export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    query,
    getEmptyCredentials,
    update
}
const STORAGE_KEY_LOGGEDIN = 'user'
const STORAGE_KEY = 'userDB'

function query() {
    return storageService.query(STORAGE_KEY)
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function login({ username, password }) {
    return storageService.query(STORAGE_KEY)
        .then(users => {
            const user = users.find(u => u.username === username)
            if (!user) return Promise.reject('Invalid login')
            if (typeof user.balance !== 'number') user.balance = 0
            if (!Array.isArray(user.activities)) user.activities = []
            if (!user.prefs) user.prefs = { color: 'black', bgColor: 'white' }
            user.updatedAt = Date.now()
            return storageService.put(STORAGE_KEY, user).then(_setLoggedinUser)
        })
}

function signup({ username, password, fullname }) {
    const user = { username, password, fullname, balance: 0, activities: [], prefs: { color: 'black', bgColor: 'white' } }
    user.createdAt = user.updatedAt = Date.now()
    return storageService.post(STORAGE_KEY, user).then(_setLoggedinUser)
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function update(user) {
    user.updatedAt = Date.now()
    return storageService.put(STORAGE_KEY, user).then(_setLoggedinUser)
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, balance: user.balance, prefs: user.prefs }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}

function getEmptyCredentials() {
    return {
        fullname: '',
        username: 'muki',
        password: 'muki1',
    }
}
