import { createSlice } from '@reduxjs/toolkit'

// We persist only token + role; user details stay in memory
const loadToken = () => localStorage.getItem('token') || null
const loadRole = () => {
    const raw = localStorage.getItem('role')
    return raw ? raw.toUpperCase() : null
}

const normalizedUser = null

const initialState = {
    user: normalizedUser,
    token: loadToken(),
    isAuthenticated: !!loadToken(),
    role: loadRole(),
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            const user = {
                ...action.payload.user,
                role: action.payload.user?.role?.toUpperCase?.(),
            }

            state.user = user
            state.token = action.payload.token
            state.role = user.role ?? null
            state.isAuthenticated = true

            localStorage.setItem('token', action.payload.token)
            if (user.role) localStorage.setItem('role', user.role)
        },
        logout(state) {
            state.user = null
            state.token = null
            state.role = null
            state.isAuthenticated = false

            localStorage.removeItem('token')
            localStorage.removeItem('role')
        },
    },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
